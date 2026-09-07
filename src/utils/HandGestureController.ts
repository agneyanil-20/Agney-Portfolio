/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

interface Landmark {
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
  public cursorX: number = window.innerWidth / 2;
  public cursorY: number = window.innerHeight / 2;
  public targetCursorX: number = window.innerWidth / 2;
  public targetCursorY: number = window.innerHeight / 2;

  // Smoothing & calibration constants
  private readonly CURSOR_SMOOTH_FACTOR = 0.28;
  private readonly CURSOR_DEADZONE_PX = 1.5;
  private readonly CAMERA_MARGIN_X = 0.12; // Active zone margin in camera view
  private readonly CAMERA_MARGIN_Y = 0.12;

  // Pinch thresholds
  private readonly PINCH_START_THRESHOLD = 0.35;
  private readonly PINCH_END_THRESHOLD = 0.45;
  private readonly CLICK_COOLDOWN_MS = 500;
  private lastClickTime: number = 0;

  // Scroll parameters
  private readonly SCROLL_DEADZONE_PX = 2.0;
  private readonly SCROLL_MULTIPLIER = 2.5;
  private prevPalmY: number | null = null;
  private smoothScrollDelta: number = 0;

  // State machine debounce
  private pendingMode: GestureMode | null = null;
  private pendingFrames: number = 0;

  // DOM elements & events
  private prevHoveredElement: Element | null = null;
  private cursorElement: HTMLElement | null = null;
  private isClickAnimating: boolean = false;

  // Callback for state changes / debug updates
  private onDebugUpdate?: (info: GestureDebugInfo) => void;

  constructor(onDebugUpdate?: (info: GestureDebugInfo) => void) {
    this.onDebugUpdate = onDebugUpdate;
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
  }

  public bindCursorElement(element: HTMLElement | null) {
    this.cursorElement = element;
  }

  /**
   * Calculates 3D Euclidean distance between two landmarks.
   */
  private dist(p1: Landmark, p2: Landmark): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Detects the number of extended fingers using landmark geometry.
   * Landmarks:
   * Wrist = 0
   * Thumb = 1..4
   * Index = 5..8
   * Middle = 9..12
   * Ring = 13..16
   * Pinky = 17..20
   */
  public detectFingerCount(landmarks: Landmark[]): {
    count: number;
    isThumb: boolean;
    isIndex: boolean;
    isMiddle: boolean;
    isRing: boolean;
    isPinky: boolean;
  } {
    const wrist = landmarks[0];

    // Four fingers: distance of tip to wrist vs PIP (joint) to wrist
    const isIndex = this.dist(landmarks[8], wrist) > this.dist(landmarks[6], wrist) * 1.08;
    const isMiddle = this.dist(landmarks[12], wrist) > this.dist(landmarks[10], wrist) * 1.08;
    const isRing = this.dist(landmarks[16], wrist) > this.dist(landmarks[14], wrist) * 1.08;
    const isPinky = this.dist(landmarks[20], wrist) > this.dist(landmarks[18], wrist) * 1.08;

    // Thumb: distance from thumb tip (4) to pinky MCP (17) vs thumb IP (3) to pinky MCP (17)
    const pinkyMCP = landmarks[17];
    const isThumb = this.dist(landmarks[4], pinkyMCP) > this.dist(landmarks[3], pinkyMCP) * 1.15;

    let count = 0;
    if (isThumb) count++;
    if (isIndex) count++;
    if (isMiddle) count++;
    if (isRing) count++;
    if (isPinky) count++;

    return { count, isThumb, isIndex, isMiddle, isRing, isPinky };
  }

  /**
   * Calculates the pinch distance between Index Tip (8) and Thumb Tip (4),
   * normalized relative to hand scale (Wrist 0 to Middle MCP 9).
   */
  public detectPinch(landmarks: Landmark[]): {
    isPinching: boolean;
    pinchRatio: number;
  } {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];

    const pinchDistance = this.dist(thumbTip, indexTip);
    const handScale = Math.max(this.dist(wrist, middleMCP), 0.05);
    const pinchRatio = pinchDistance / handScale;

    // Hysteresis threshold check
    let isPinching = this.isPinching;
    if (!isPinching && pinchRatio < this.PINCH_START_THRESHOLD) {
      isPinching = true;
    } else if (isPinching && pinchRatio > this.PINCH_END_THRESHOLD) {
      isPinching = false;
    }

    return { isPinching, pinchRatio };
  }

  /**
   * Updates virtual cursor target coordinates based on index fingertip (landmark 8).
   * Maps camera normalized coordinates (mirrored X) to viewport dimensions.
   */
  public updateCursor(indexTip: Landmark) {
    // Camera is mirrored horizontally: screenX maps from (1 - indexTip.x)
    const nx = 1 - indexTip.x;
    const ny = indexTip.y;

    // Expand central active region to reach screen edges easily
    const clampedNx = Math.min(
      Math.max((nx - this.CAMERA_MARGIN_X) / (1 - 2 * this.CAMERA_MARGIN_X), 0),
      1
    );
    const clampedNy = Math.min(
      Math.max((ny - this.CAMERA_MARGIN_Y) / (1 - 2 * this.CAMERA_MARGIN_Y), 0),
      1
    );

    this.targetCursorX = clampedNx * window.innerWidth;
    this.targetCursorY = clampedNy * window.innerHeight;

    // During active pinch, stabilize cursor heavily so the click doesn't shift
    const smoothFactor = this.isPinching ? 0.06 : this.CURSOR_SMOOTH_FACTOR;

    const dx = this.targetCursorX - this.cursorX;
    const dy = this.targetCursorY - this.cursorY;
    const distToTarget = Math.hypot(dx, dy);

    // Apply deadzone to remove tiny hand tremors
    if (distToTarget > this.CURSOR_DEADZONE_PX) {
      this.cursorX += dx * smoothFactor;
      this.cursorY += dy * smoothFactor;
    }

    // Clamp coordinates inside browser viewport
    this.cursorX = Math.min(Math.max(0, this.cursorX), window.innerWidth);
    this.cursorY = Math.min(Math.max(0, this.cursorY), window.innerHeight);

    // Simulate mouse hover events
    this.simulateHover(this.cursorX, this.cursorY);
  }

  /**
   * Dispatches hover/mousemove events on elements underneath the virtual cursor.
   */
  private simulateHover(x: number, y: number) {
    const rawTarget = document.elementFromPoint(x, y);

    if (rawTarget !== this.prevHoveredElement) {
      if (this.prevHoveredElement) {
        this.prevHoveredElement.dispatchEvent(
          new MouseEvent("mouseout", { bubbles: true, cancelable: true, clientX: x, clientY: y })
        );
        this.prevHoveredElement.dispatchEvent(
          new MouseEvent("mouseleave", { bubbles: false, clientX: x, clientY: y })
        );
        this.prevHoveredElement.classList.remove("hand-hover", "hovered", "spatial-hover");
      }

      if (rawTarget) {
        rawTarget.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true, cancelable: true, clientX: x, clientY: y })
        );
        rawTarget.dispatchEvent(
          new MouseEvent("mouseenter", { bubbles: false, clientX: x, clientY: y })
        );
        rawTarget.classList.add("hand-hover", "hovered", "spatial-hover");
      }

      this.prevHoveredElement = rawTarget;
    }

    if (rawTarget) {
      rawTarget.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, cancelable: true, clientX: x, clientY: y })
      );
      const clickable = rawTarget.closest(
        'button, a, input, label, select, textarea, [role="button"], [onclick], [tabindex], .cursor-pointer, [data-cursor="interactive"]'
      );
      this.isHoveringClickable = !!clickable;
    } else {
      this.isHoveringClickable = false;
    }
  }

  /**
   * Handles clicking on the element under the virtual cursor when pinch triggers.
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

    // Trigger visual cursor click pulse
    this.triggerClickAnimation();

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

    // Walk up DOM for interactive tag
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
   * Creates a momentary click ripple and cursor animation.
   */
  private triggerClickAnimation() {
    this.isClickAnimating = true;

    // Create transient click ring ripple
    const ripple = document.createElement("div");
    ripple.className = "hand-click-ripple";
    ripple.style.position = "fixed";
    ripple.style.pointerEvents = "none";
    ripple.style.borderRadius = "50%";
    ripple.style.border = "2px solid #FF3B30";
    ripple.style.backgroundColor = "rgba(255, 59, 48, 0.25)";
    ripple.style.width = "36px";
    ripple.style.height = "36px";
    ripple.style.left = `${this.cursorX}px`;
    ripple.style.top = `${this.cursorY}px`;
    ripple.style.transform = "translate(-50%, -50%) scale(0.2)";
    ripple.style.opacity = "1";
    ripple.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out";
    ripple.style.zIndex = "1000000";

    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = "translate(-50%, -50%) scale(1.8)";
      ripple.style.opacity = "0";
    });

    setTimeout(() => {
      ripple.remove();
      this.isClickAnimating = false;
    }, 350);
  }

  /**
   * Smoothly scrolls the window when 3+ fingers are moving up or down.
   */
  public updateScroll(landmarks: Landmark[]) {
    // Reference point: center of palm (midpoint of Wrist 0 and Middle MCP 9)
    const palmY = (landmarks[0].y + landmarks[9].y) / 2;
    const currentPixelPalmY = palmY * window.innerHeight;

    if (this.prevPalmY === null) {
      this.prevPalmY = currentPixelPalmY;
      this.smoothScrollDelta = 0;
      return;
    }

    const deltaY = currentPixelPalmY - this.prevPalmY;
    this.prevPalmY = currentPixelPalmY;

    // Exponential smoothing to eradicate camera noise
    this.smoothScrollDelta = this.smoothScrollDelta * 0.35 + deltaY * 0.65;

    // Apply deadzone and execute scroll
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
    const fingers = this.detectFingerCount(landmarks);
    this.extendedFingerCount = fingers.count;

    // 2. Detect pinch
    const pinch = this.detectPinch(landmarks);
    const wasPinching = this.isPinching;
    this.isPinching = pinch.isPinching;
    this.pinchRatio = pinch.pinchRatio;

    // 3. Determine candidate mode based on clear priority
    // Priority 1: 3+ fingers -> SCROLL MODE
    // Priority 2: Pinch -> CLICK MODE
    // Priority 3: Index finger -> POINTER MODE
    // Priority 4: Otherwise -> IDLE MODE
    let candidateMode: GestureMode = "idle";

    if (fingers.count >= 3) {
      candidateMode = "scroll";
    } else if (this.isPinching || (fingers.isIndex && this.pinchRatio < this.PINCH_START_THRESHOLD)) {
      candidateMode = "pinch";
    } else if (fingers.isIndex && !fingers.isMiddle && !fingers.isRing && !fingers.isPinky) {
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

    if (this.currentMode === "pointer" || this.currentMode === "pinch") {
      this.updateCursor(landmarks[8]);
    }

    // Single click trigger on transition from OPEN -> PINCH
    if (!wasPinching && this.isPinching && (this.currentMode === "pinch" || this.currentMode === "pointer")) {
      this.handleClick();
    }

    // 6. Update virtual cursor DOM element
    this.renderCursorElement();

    // 7. Emit telemetry for debug panel
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
      // Pinch triggers rapidly (1 frame), scroll & pointer require 2 frames
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

    if (this.prevHoveredElement) {
      this.prevHoveredElement.classList.remove("hand-hover", "hovered", "spatial-hover");
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
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(0.5)`;
      return;
    }

    this.cursorElement.style.opacity = "1";

    if (this.currentMode === "scroll") {
      // In scroll mode, morph into a dedicated scroll indicator badge
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(0.9)`;
      this.cursorElement.setAttribute("data-mode", "scroll");
    } else if (this.currentMode === "pinch" || this.isClickAnimating) {
      // Pinch click state
      this.cursorElement.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) scale(1.35)`;
      this.cursorElement.setAttribute("data-mode", "pinch");
    } else {
      // Pointer mode
      const scale = this.isHoveringClickable ? 1.25 : 1.0;
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
