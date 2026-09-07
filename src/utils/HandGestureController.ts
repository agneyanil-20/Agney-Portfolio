/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Developer debug switch - false for production UI
export const DEBUG_HAND_TRACKING = false;

export type GestureMode = "idle" | "pointer" | "pinch" | "scroll";

export interface GestureDebugInfo {
  isActive: boolean;
  handDetected: boolean;
  gesture: GestureMode;
  fingerCount: number;
  cursor: { x: number; y: number };
  pinchState: "OPEN" | "ACTIVE";
  pinchRatio: number;
  scrollDelta: number;
}

export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export class HandGestureController {
  // Current gesture state
  public currentMode: GestureMode = "idle";
  public handDetected: boolean = false;
  public extendedFingerCount: number = 0;
  public pinchRatio: number = 1.0;
  public isPinching: boolean = false;
  public isClickCoolingDown: boolean = false;
  public isHoveringClickable: boolean = false;

  // Virtual cursor positions
  public cursorX: number = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  public cursorY: number = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  public targetCursorX: number = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  public targetCursorY: number = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

  // Smoothing & mapping calibration constants
  private readonly CURSOR_DEADZONE_PX = 1.8;
  private readonly CAMERA_MARGIN_X = 0.12; // Active zone margin in camera view
  private readonly CAMERA_MARGIN_Y = 0.12;

  // Pinch & click thresholds
  private readonly PINCH_START_THRESHOLD = 0.33;
  private readonly PINCH_RELEASE_THRESHOLD = 0.46;
  private readonly CLICK_COOLDOWN_MS = 400;
  private lastClickTime: number = 0;
  private pinchFrames: number = 0;
  private releaseFrames: number = 0;
  private hasClickedThisPinch: boolean = false;

  // Scroll parameters
  private readonly SCROLL_DEADZONE_PX = 1.8;
  private readonly SCROLL_MULTIPLIER = 2.5;
  private prevPalmY: number | null = null;
  private smoothScrollDelta: number = 0;

  // State machine debounce
  private pendingMode: GestureMode | null = null;
  private pendingFrames: number = 0;

  // DOM element tracking
  private prevHoveredElement: Element | null = null;
  private cursorElement: HTMLElement | null = null;

  // Callback for state changes / debug updates
  private onDebugUpdate?: (info: GestureDebugInfo) => void;

  constructor(onDebugUpdate?: (info: GestureDebugInfo) => void) {
    this.onDebugUpdate = onDebugUpdate;
    if (typeof window !== "undefined") {
      this.cursorX = window.innerWidth / 2;
      this.cursorY = window.innerHeight / 2;
      this.targetCursorX = this.cursorX;
      this.targetCursorY = this.cursorY;
    }
  }

  public bindCursorElement(element: HTMLElement | null) {
    this.cursorElement = element;
  }

  /**
   * Calculates 3D Euclidean distance between two landmarks.
   */
  public dist(p1: Landmark, p2: Landmark): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Detects the number of extended fingers and finger states using landmark geometry.
   * Landmarks:
   * Wrist = 0
   * Thumb = 1..4
   * Index = 5..8
   * Middle = 9..12
   * Ring = 13..16
   * Pinky = 17..20
   */
  public detectFingerStates(landmarks: Landmark[]): {
    count: number;
    isThumb: boolean;
    isIndex: boolean;
    isMiddle: boolean;
    isRing: boolean;
    isPinky: boolean;
    isIndexPointing: boolean;
  } {
    const wrist = landmarks[0];

    // Four fingers: distance of tip to wrist vs PIP (joint) to wrist
    const isIndex =
      this.dist(landmarks[8], wrist) > this.dist(landmarks[6], wrist) * 1.12 &&
      this.dist(landmarks[8], landmarks[5]) > this.dist(landmarks[6], landmarks[5]) * 1.3;

    const isMiddle = this.dist(landmarks[12], wrist) > this.dist(landmarks[10], wrist) * 1.1;
    const isRing = this.dist(landmarks[16], wrist) > this.dist(landmarks[14], wrist) * 1.1;
    const isPinky = this.dist(landmarks[20], wrist) > this.dist(landmarks[18], wrist) * 1.1;

    // Thumb: distance from thumb tip (4) to pinky MCP (17) vs thumb IP (3) to pinky MCP (17)
    const pinkyMCP = landmarks[17];
    const isThumb = this.dist(landmarks[4], pinkyMCP) > this.dist(landmarks[3], pinkyMCP) * 1.15;

    let count = 0;
    if (isThumb) count++;
    if (isIndex) count++;
    if (isMiddle) count++;
    if (isRing) count++;
    if (isPinky) count++;

    // Dedicated Pointing Gesture:
    // Index finger is extended, while middle, ring, and pinky are curled/folded
    const isIndexPointing = isIndex && !isMiddle && !isRing && !isPinky;

    return { count, isThumb, isIndex, isMiddle, isRing, isPinky, isIndexPointing };
  }

  /**
   * Calculates normalized pinch distance between Index Tip (8) and Thumb Tip (4),
   * scaled relative to hand size (Wrist 0 to Middle MCP 9).
   */
  public calculatePinchRatio(landmarks: Landmark[]): number {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];

    const pinchDistance = this.dist(thumbTip, indexTip);
    const handScale = Math.max(this.dist(wrist, middleMCP), 0.05);
    return pinchDistance / handScale;
  }

  /**
   * Updates virtual cursor target coordinates based on index fingertip (landmark 8).
   * Maps camera normalized coordinates (mirrored X) to viewport dimensions with margins.
   */
  public updateCursor(indexTip: Landmark) {
    if (typeof window === "undefined") return;

    // Camera is mirrored horizontally for the user:
    // User moves left -> camera sensor sees right (x increases) -> mirrored (1 - x) decreases -> screenX moves left
    const mirroredX = 1 - indexTip.x;
    const mirroredY = indexTip.y;

    // Active zone expansion so user reaches all 4 viewport borders comfortably
    const clampedNx = Math.min(
      Math.max((mirroredX - this.CAMERA_MARGIN_X) / (1 - 2 * this.CAMERA_MARGIN_X), 0),
      1
    );
    const clampedNy = Math.min(
      Math.max((mirroredY - this.CAMERA_MARGIN_Y) / (1 - 2 * this.CAMERA_MARGIN_Y), 0),
      1
    );

    this.targetCursorX = clampedNx * window.innerWidth;
    this.targetCursorY = clampedNy * window.innerHeight;

    // If currently pinching, freeze cursor heavily to avoid drift during click
    if (this.isPinching) {
      this.simulateHover(this.cursorX, this.cursorY);
      return;
    }

    const dx = this.targetCursorX - this.cursorX;
    const dy = this.targetCursorY - this.cursorY;
    const distToTarget = Math.hypot(dx, dy);

    // Deadzone filter eliminates hand micro-tremors
    if (distToTarget > this.CURSOR_DEADZONE_PX) {
      // Adaptive exponential smoothing:
      // Slow/small movements -> alpha ~ 0.22 (silky stable)
      // Fast flicks -> alpha smoothly scales to ~0.60 (instant response, low lag)
      const speedFactor = Math.min(1, Math.max(0, (distToTarget - this.CURSOR_DEADZONE_PX) / 120));
      const alpha = 0.22 + speedFactor * 0.38;

      this.cursorX += dx * alpha;
      this.cursorY += dy * alpha;
    }

    // Clamp coordinates securely within the browser viewport
    this.cursorX = Math.min(Math.max(0, this.cursorX), window.innerWidth);
    this.cursorY = Math.min(Math.max(0, this.cursorY), window.innerHeight);

    // Update hover states cleanly
    this.simulateHover(this.cursorX, this.cursorY);
  }

  /**
   * Dispatches hover/mousemove events on elements underneath the virtual cursor
   * without adding ANY custom borders, outlines, boxes, or classes.
   */
  private simulateHover(x: number, y: number) {
    if (typeof document === "undefined") return;

    const rawTarget = document.elementFromPoint(x, y);

    if (rawTarget !== this.prevHoveredElement) {
      if (this.prevHoveredElement) {
        this.prevHoveredElement.dispatchEvent(
          new MouseEvent("mouseout", { bubbles: true, cancelable: true, clientX: x, clientY: y })
        );
        this.prevHoveredElement.dispatchEvent(
          new MouseEvent("mouseleave", { bubbles: false, clientX: x, clientY: y })
        );
      }

      if (rawTarget) {
        rawTarget.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true, cancelable: true, clientX: x, clientY: y })
        );
        rawTarget.dispatchEvent(
          new MouseEvent("mouseenter", { bubbles: false, clientX: x, clientY: y })
        );
      }

      this.prevHoveredElement = rawTarget;
    }

    if (rawTarget) {
      rawTarget.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, cancelable: true, clientX: x, clientY: y })
      );

      // Check if interactive strictly for subtle cursor scaling (no DOM modification)
      const clickable = rawTarget.closest(
        'button, a, input, label, select, textarea, [role="button"], [onclick], [tabindex], .cursor-pointer, [data-cursor="interactive"]'
      );
      this.isHoveringClickable = Boolean(clickable);
    } else {
      this.isHoveringClickable = false;
    }
  }

  /**
   * Handles clicking on the element under the virtual cursor when pinch triggers.
   * Fires exactly once per pinch gesture.
   */
  public handleClick() {
    const now = performance.now();
    if (now - this.lastClickTime < this.CLICK_COOLDOWN_MS) {
      return;
    }
    this.lastClickTime = now;
    this.isClickCoolingDown = true;
    setTimeout(() => {
      this.isClickCoolingDown = false;
    }, this.CLICK_COOLDOWN_MS);

    if (typeof document === "undefined") return;

    const target = document.elementFromPoint(this.cursorX, this.cursorY);
    if (!target) return;

    // Dispatch mousedown and mouseup
    target.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: this.cursorX,
        clientY: this.cursorY,
        buttons: 1,
      })
    );

    target.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: this.cursorX,
        clientY: this.cursorY,
        buttons: 0,
      })
    );

    // Click interactive element or fallback to target
    const clickable = target.closest(
      'button, a, input, label, select, textarea, [role="button"], [onclick], [tabindex], .cursor-pointer, [data-cursor="interactive"]'
    );

    if (clickable && typeof (clickable as HTMLElement).click === "function") {
      (clickable as HTMLElement).click();
    } else if (typeof (target as HTMLElement).click === "function") {
      (target as HTMLElement).click();
    } else {
      target.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: this.cursorX,
          clientY: this.cursorY,
        })
      );
    }
  }

  /**
   * Smoothly scrolls the window when 3+ fingers are held open.
   * Uses palm center Y to ensure stability.
   */
  public updateScroll(landmarks: Landmark[]) {
    if (typeof window === "undefined") return;

    // Palm center: midpoint of Wrist (0) and Middle MCP (9)
    const palmY = (landmarks[0].y + landmarks[9].y) / 2;
    const currentPixelPalmY = palmY * window.innerHeight;

    if (this.prevPalmY === null) {
      this.prevPalmY = currentPixelPalmY;
      this.smoothScrollDelta = 0;
      return;
    }

    const deltaY = currentPixelPalmY - this.prevPalmY;
    this.prevPalmY = currentPixelPalmY;

    // Exponential smoothing
    this.smoothScrollDelta = this.smoothScrollDelta * 0.35 + deltaY * 0.65;

    // Deadzone and scrolling
    if (Math.abs(this.smoothScrollDelta) > this.SCROLL_DEADZONE_PX) {
      const scrollAmount = this.smoothScrollDelta * this.SCROLL_MULTIPLIER;
      window.scrollBy({
        top: scrollAmount,
        left: 0,
        behavior: "auto",
      });
    }
  }

  /**
   * Main entrypoint called every video frame with detected hand landmarks.
   */
  public processLandmarks(landmarks: Landmark[] | null | undefined) {
    if (!landmarks || landmarks.length < 21) {
      this.handleHandLost();
      return;
    }

    this.handDetected = true;

    // 1. Detect extended fingers
    const fingerStates = this.detectFingerStates(landmarks);
    this.extendedFingerCount = fingerStates.count;

    // 2. Pinch detection with hysteresis & multi-frame confirmation
    this.pinchRatio = this.calculatePinchRatio(landmarks);

    if (this.pinchRatio < this.PINCH_START_THRESHOLD) {
      this.pinchFrames++;
      this.releaseFrames = 0;
      // Require 2 stable frames of close pinch to confirm
      if (this.pinchFrames >= 2) {
        this.isPinching = true;
      }
    } else if (this.pinchRatio > this.PINCH_RELEASE_THRESHOLD) {
      this.releaseFrames++;
      this.pinchFrames = 0;
      // Require 2 stable frames of release to reset
      if (this.releaseFrames >= 2) {
        this.isPinching = false;
        this.hasClickedThisPinch = false;
      }
    }

    // 3. Determine candidate mode based on STRICT PRIORITY:
    // Priority 1: 3+ fingers -> SCROLL MODE
    // Priority 2: Pinch -> CLICK MODE
    // Priority 3: Index finger pointing -> POINTER MODE
    // Priority 4: Otherwise -> IDLE MODE
    let candidateMode: GestureMode = "idle";

    if (fingerStates.count >= 3) {
      candidateMode = "scroll";
    } else if (this.isPinching) {
      candidateMode = "pinch";
    } else if (fingerStates.isIndexPointing) {
      candidateMode = "pointer";
    } else {
      candidateMode = "idle";
    }

    // 4. Update gesture state machine with frame hysteresis
    this.updateGestureState(candidateMode);

    // 5. Execute action based on active mode
    if (this.currentMode === "scroll") {
      this.updateScroll(landmarks);
    } else {
      this.prevPalmY = null;
      this.smoothScrollDelta = 0;
    }

    // Pointer and Pinch update cursor coordinates
    if (this.currentMode === "pointer" || this.currentMode === "pinch") {
      this.updateCursor(landmarks[8]);
    }

    // Single click trigger on transition into confirmed pinch
    if (this.isPinching && !this.hasClickedThisPinch && this.currentMode !== "scroll") {
      this.handleClick();
      this.hasClickedThisPinch = true;
    }

    // 6. Update virtual cursor DOM element
    this.renderCursorElement();

    // 7. Emit telemetry for debug purposes if active
    if (this.onDebugUpdate) {
      this.onDebugUpdate({
        isActive: true,
        handDetected: true,
        gesture: this.currentMode,
        fingerCount: this.extendedFingerCount,
        cursor: { x: Math.round(this.cursorX), y: Math.round(this.cursorY) },
        pinchState: this.isPinching ? "ACTIVE" : "OPEN",
        pinchRatio: Number(this.pinchRatio.toFixed(2)),
        scrollDelta: Math.round(this.smoothScrollDelta),
      });
    }
  }

  /**
   * Applies debounce / hysteresis to prevent jittery mode switching.
   */
  private updateGestureState(candidateMode: GestureMode) {
    if (candidateMode === this.currentMode) {
      this.pendingMode = null;
      this.pendingFrames = 0;
      return;
    }

    if (candidateMode === this.pendingMode) {
      this.pendingFrames++;
      const requiredFrames = candidateMode === "pinch" ? 1 : 2;

      if (this.pendingFrames >= requiredFrames) {
        this.currentMode = candidateMode;
        this.pendingMode = null;
        this.pendingFrames = 0;
      }
    } else {
      this.pendingMode = candidateMode;
      this.pendingFrames = 1;
    }
  }

  /**
   * Resets tracking state when the hand exits the camera frame.
   */
  public handleHandLost() {
    this.handDetected = false;
    this.currentMode = "idle";
    this.pendingMode = null;
    this.pendingFrames = 0;
    this.prevPalmY = null;
    this.smoothScrollDelta = 0;
    this.isPinching = false;
    this.hasClickedThisPinch = false;
    this.pinchFrames = 0;
    this.releaseFrames = 0;

    if (this.prevHoveredElement) {
      this.prevHoveredElement.dispatchEvent(
        new MouseEvent("mouseout", { bubbles: true, cancelable: true })
      );
      this.prevHoveredElement.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: false })
      );
      this.prevHoveredElement = null;
    }

    this.renderCursorElement();

    if (this.onDebugUpdate) {
      this.onDebugUpdate({
        isActive: true,
        handDetected: false,
        gesture: "idle",
        fingerCount: 0,
        cursor: { x: Math.round(this.cursorX), y: Math.round(this.cursorY) },
        pinchState: "OPEN",
        pinchRatio: 1.0,
        scrollDelta: 0,
      });
    }
  }

  /**
   * Updates styling, position, and visibility of the `<div id="hand-cursor">` element.
   */
  public renderCursorElement() {
    if (!this.cursorElement) return;

    if (!this.handDetected || this.currentMode === "idle") {
      this.cursorElement.style.opacity = "0";
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(0.6)`;
      return;
    }

    this.cursorElement.style.opacity = "1";

    if (this.currentMode === "scroll") {
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(0.9)`;
      this.cursorElement.setAttribute("data-mode", "scroll");
    } else if (this.currentMode === "pinch") {
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(0.85)`;
      this.cursorElement.setAttribute("data-mode", "pinch");
    } else {
      const scale = this.isHoveringClickable ? 1.2 : 1.0;
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(${scale})`;
      this.cursorElement.setAttribute("data-mode", this.isHoveringClickable ? "hover" : "pointer");
    }
  }

  /**
   * Cleanup on component unmount or tracking disabled.
   */
  public destroy() {
    this.handleHandLost();
    if (this.cursorElement) {
      this.cursorElement.style.opacity = "0";
    }
  }
}
