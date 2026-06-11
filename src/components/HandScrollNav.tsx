/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Beautiful custom pixel art icons matching the Moon & Sun toggle
const HAND_PIXELS = [
  0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 1, 0, 0
];

const CAM_PIXELS = [
  0, 1, 1, 1, 1, 1, 1, 0,
  1, 0, 0, 0, 0, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1
];

export default function HandScrollNav() {
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [statusText, setStatusText] = useState("Off");
  const [loadingText, setLoadingText] = useState("");
  const [handDetected, setHandDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<string>("STATIONARY");
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ===================================================
  // SWIPE-AND-RESET & SPATIAL INTERACTION COEFFICIENTS
  // ===================================================
  const GESTURE_COOLDOWN_MS = 750;     // Delay before next gesture is permitted (600ms - 800ms)
  const SWIPE_THRESHOLD_Y = 0.15;      // Delta Y vertical scale threshold required (0.15)
  const SWIPE_WINDOW_MS = 150;         // Time window to evaluate the rapid change (150ms)
  const SCROLL_DISTANCE = 450;         // Fixed scroll distance applied smoothly on swipe (px)
  const CURSOR_SMOOTHING_EASE = 0.15;  // Linear Interpolation (Lerp) speed weighting
  const PINCH_THRESHOLD = 0.04;        // 3D Distance coefficient below which a pinch is registered (< 0.04)
  const CLICK_DEBOUNCE_MS = 500;       // Minimum milliseconds between registered click events

  // Hand movement tracking buffers
  const touchHistoryRef = useRef<{ y: number; t: number }[]>([]);
  const cooldownUntilRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  const fpsFrameCountRef = useRef<number>(0);
  const fpsLastTimeRef = useRef<number>(0);

  // Mapped screen-space cursor tracking coordinates
  const targetPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const actualPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const virtualCursorRef = useRef<HTMLDivElement>(null);
  const prevHoveredElementRef = useRef<Element | null>(null);
  const cursorAnimFrameRef = useRef<number | null>(null);
  const isPinchingRef = useRef(false);  // Sync tracking lock for freeze protocol

  // Track body tracking class active state
  useEffect(() => {
    if (isActive && handDetected) {
      document.body.classList.add("hand-tracking-active");
    } else {
      document.body.classList.remove("hand-tracking-active");
    }
    return () => {
      document.body.classList.remove("hand-tracking-active");
    };
  }, [isActive, handDetected]);

  // Handle keyboard shortcut [G] and [Escape] to toggle gesture guide overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement && (
        activeElement.tagName === "INPUT" || 
        activeElement.tagName === "TEXTAREA" || 
        (activeElement as HTMLElement).isContentEditable
      );
      if (isInput) return;

      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        setIsGuideOpen(prev => !prev);
      } else if (e.key === "Escape" && isGuideOpen) {
        setIsGuideOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGuideOpen]);

  // Utility to trace clickable elements recursively up the DOM tree (e.g. for inner spans or SVG icons)
  const findClickableElement = (el: Element | null): Element | null => {
    let current: Element | null = el;
    for (let i = 0; i < 4; i++) {
      if (!current) break;
      const tagName = current.tagName?.toLowerCase();
      const isInteractiveTag = ["button", "a", "input", "select", "textarea"].includes(tagName);
      const hasPointerCursor = window.getComputedStyle(current).cursor === "pointer";
      const hasCursorAttr = current.getAttribute("data-cursor") === "interactive";
      if (isInteractiveTag || hasPointerCursor || hasCursorAttr || current.classList.contains("cursor-pointer")) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  };

  const cleanupHover = () => {
    if (prevHoveredElementRef.current) {
      prevHoveredElementRef.current.classList.remove("hovered");
      prevHoveredElementRef.current.classList.remove("spatial-hover");
      prevHoveredElementRef.current = null;
    }
    setIsHovering(false);
  };

  const startCursorLoop = () => {
    const updateCursor = () => {
      const target = targetPosRef.current;
      const actual = actualPosRef.current;

      // FREEZE PROTOCOL: When a pinch-to-click gesture is actively engaged, freeze updates 
      // to lock the cursor coordinates, neutralizing accidental camera drift/hand jitter.
      if (!isPinchingRef.current) {
        // Linear interpolation (Lerp) for silky smooth cursor tracking with custom weighted ease
        actual.x = actual.x + (target.x - actual.x) * CURSOR_SMOOTHING_EASE;
        actual.y = actual.y + (target.y - actual.y) * CURSOR_SMOOTHING_EASE;
      }

      // Update virtual cursor positions directly on DOM element ref
      if (virtualCursorRef.current) {
        virtualCursorRef.current.style.transform = `translate3d(${actual.x}px, ${actual.y}px, 0)`;
      }

      // Live hover tracing detection
      if (handDetected) {
        const rawElement = document.elementFromPoint(actual.x, actual.y);
        const clickableElement = findClickableElement(rawElement);

        if (clickableElement !== prevHoveredElementRef.current) {
          if (prevHoveredElementRef.current) {
            prevHoveredElementRef.current.classList.remove("hovered");
            prevHoveredElementRef.current.classList.remove("spatial-hover");
          }
          if (clickableElement) {
            clickableElement.classList.add("hovered");
            clickableElement.classList.add("spatial-hover");
            setIsHovering(true);
          } else {
            setIsHovering(false);
          }
          prevHoveredElementRef.current = clickableElement;
        }
      } else {
        cleanupHover();
      }

      cursorAnimFrameRef.current = requestAnimationFrame(updateCursor);
    };

    cursorAnimFrameRef.current = requestAnimationFrame(updateCursor);
  };

  const stopCursorLoop = () => {
    if (cursorAnimFrameRef.current) {
      cancelAnimationFrame(cursorAnimFrameRef.current);
      cursorAnimFrameRef.current = null;
    }
    cleanupHover();
  };

  // Initialize MediaPipe HandLandmarker when turning active
  const startTracking = async () => {
    try {
      setStatusText("Initializing");
      setLoadingText("Loading WASM module...");

      if (!landmarkerRef.current) {
        // Resolve task vision using external filesets on jsdelivr
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        
        setLoadingText("Loading AI model...");
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
      }

      setLoadingText("Accessing camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setLoadingText("");
          setStatusText("Active");
          fpsLastTimeRef.current = performance.now();
          animationFrameRef.current = requestAnimationFrame(predictFrameLoop);
          startCursorLoop(); // Initialize secondary high-frequency cursor rendering loop
        };
      }
    } catch (err: any) {
      console.error("Failed to boot hand sensor:", err);
      setStatusText("Error");
      setLoadingText(`Error: ${err.message || "Camera blocked"}`);
      setIsActive(false);
    }
  };

  const stopTracking = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    stopCursorLoop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatusText("Off");
    setHandDetected(false);
    setScrollDirection("STATIONARY");
  };

  // Switch state hand navigation trigger
  const handleToggle = () => {
    if (isActive) {
      stopTracking();
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  useEffect(() => {
    if (isActive) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => {
      stopTracking();
    };
  }, [isActive]);

  const predictFrameLoop = () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const canvas = canvasRef.current;

    if (!video || !landmarker || !video.srcObject) return;

    if (video.readyState >= 3) {
      const timestamp = performance.now();
      const results = landmarker.detectForVideo(video, timestamp);

      // Setup/resize canvas overlay
      if (canvas) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate running estimation FPS
          fpsFrameCountRef.current++;
          if (timestamp >= fpsLastTimeRef.current + 1000) {
            setFps(Math.round((fpsFrameCountRef.current * 1000) / (timestamp - fpsLastTimeRef.current)));
            fpsFrameCountRef.current = 0;
            fpsLastTimeRef.current = timestamp;
          }

          if (results.landmarks && results.landmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.landmarks[0];
            
            // Draw skeleton landmarks in red
            drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);

            // Track only the TIP of the index finger (Landmark 8) or middle finger (Landmark 12)
            // Landmark 12 is the middle finger tip, Landmark 8 is the index finger tip. Let's use Landmark 8.
            const fingerTip = landmarks[8];
            const currentY = fingerTip.y;
            const currentTime = timestamp;

            // Map coordinates dynamically for virtual pointer target x and y (mirror the X axis)
            const targetX = (1 - fingerTip.x) * window.innerWidth;
            const targetY = fingerTip.y * window.innerHeight;

            // Pinch-to-Click Detection (Calculate 3D Euclidean distance between thumb tip Landmark 4 and index tip Landmark 8)
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            let isPinchingNow = false;

            if (thumbTip && indexTip) {
              const dx = thumbTip.x - indexTip.x;
              const dy = thumbTip.y - indexTip.y;
              const dz = thumbTip.z - indexTip.z;
              const pinchDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (pinchDistance < PINCH_THRESHOLD) {
                isPinchingNow = true;
              }
            }

            // Sync sync state protocol ref
            isPinchingRef.current = isPinchingNow;

            // Freeze mapping when actively pinching (locks target position in place)
            if (!isPinchingNow) {
              targetPosRef.current = { x: targetX, y: targetY };
            }

            // Fire precise select click events upon entering primary pinch lock
            if (isPinchingNow) {
              if (currentTime - lastClickTimeRef.current > CLICK_DEBOUNCE_MS) {
                lastClickTimeRef.current = currentTime;
                setIsClicked(true);
                setTimeout(() => setIsClicked(false), 200);

                const clickX = actualPosRef.current.x;
                const clickY = actualPosRef.current.y;
                const rawElem = document.elementFromPoint(clickX, clickY);
                const clickable = findClickableElement(rawElem);

                const elToClick = clickable || rawElem;
                if (elToClick) {
                  (elToClick as HTMLElement).click();

                  // Create high-fashion aesthetic pointer feedback simulation ripple
                  const rip = document.createElement("div");
                  rip.style.position = "fixed";
                  rip.style.pointerEvents = "none";
                  rip.style.borderRadius = "50%";
                  rip.style.border = "2px solid #FF3B30";
                  rip.style.backgroundColor = "rgba(255, 59, 48, 0.2)";
                  rip.style.width = "40px";
                  rip.style.height = "40px";
                  rip.style.left = `${clickX}px`;
                  rip.style.top = `${clickY}px`;
                  rip.style.transform = "translate(-50%, -50%) scale(0.1)";
                  rip.style.opacity = "1";
                  rip.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
                  rip.style.zIndex = "10000";
                  document.body.appendChild(rip);

                  // Trigger scale animation
                  requestAnimationFrame(() => {
                    rip.style.transform = "translate(-50%, -50%) scale(1.6)";
                    rip.style.opacity = "0";
                  });

                  setTimeout(() => {
                    rip.remove();
                  }, 400);
                }
              }
            }

            // Check if we are currently inside a GESTURE_COOLDOWN_MS period
            if (currentTime < cooldownUntilRef.current) {
              setScrollDirection("COOLING_DOWN");
              // Clear tracking history during cooldown to ensure a fresh reference afterwards
              touchHistoryRef.current = [];
            } else {
              // Store coordinates with timestamps
              touchHistoryRef.current.push({ y: currentY, t: currentTime });

              // Filter out coordinate frames older than the time window
              const cutoffTime = currentTime - SWIPE_WINDOW_MS;
              touchHistoryRef.current = touchHistoryRef.current.filter(p => p.t >= cutoffTime);

              if (touchHistoryRef.current.length > 1) {
                const oldestPoint = touchHistoryRef.current[0];
                const deltaY = currentY - oldestPoint.y;

                // MediaPipe coordinate space: Y increases downwards.
                // - A rapid decrease in Y (negative deltaY) represents an UPWARD SWIPE.
                // - A rapid increase in Y (positive deltaY) represents a DOWNWARD SWIPE.
                if (deltaY < -SWIPE_THRESHOLD_Y) {
                  // Upward Swipe detected -> scroll DOWN
                  window.scrollBy({ top: SCROLL_DISTANCE, behavior: "smooth" });
                  setScrollDirection("SWIPE_DETECTED_DOWN");
                  cooldownUntilRef.current = currentTime + GESTURE_COOLDOWN_MS;
                  touchHistoryRef.current = []; // Clear history
                } else if (deltaY > SWIPE_THRESHOLD_Y) {
                  // Downward Swipe detected -> scroll UP
                  window.scrollBy({ top: -SCROLL_DISTANCE, behavior: "smooth" });
                  setScrollDirection("SWIPE_DETECTED_UP");
                  cooldownUntilRef.current = currentTime + GESTURE_COOLDOWN_MS;
                  touchHistoryRef.current = []; // Clear history
                } else {
                  setScrollDirection("STATIONARY");
                }
              } else {
                setScrollDirection("STATIONARY");
              }
            }
          } else {
            setHandDetected(false);
            // Maintain COOLING_DOWN display if within time limit even after hand exits the frame
            if (timestamp < cooldownUntilRef.current) {
              setScrollDirection("COOLING_DOWN");
            } else {
              setScrollDirection("STATIONARY");
            }
            touchHistoryRef.current = [];
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictFrameLoop);
  };

  // Direct skeletal node mapping styling as a clean high-fidelity visualIZER overlay
  const drawHandSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
    ctx.strokeStyle = "rgba(255, 59, 48, 0.55)";
    ctx.lineWidth = 2.5;

    // Palm / joint connections paths list
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17]
    ];

    connections.forEach(([i1, i2]) => {
      const p1 = landmarks[i1];
      const p2 = landmarks[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    });

    // Node circles decoration
    landmarks.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF3B30";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-12 z-50 flex flex-col items-start gap-2">
        {/* Sleek Floating control switcher toggling camera panel activation */}
        <div className="flex items-center gap-1.5 shadow-xl bg-black border border-zinc-800 p-1.5 keep-dark">
          <button
            onClick={handleToggle}
            className={`group focus:outline-none p-1.5 border border-zinc-800 hover:border-[#FF3B30] bg-[#0c0c0c] transition-all duration-300 cursor-pointer select-none`}
            title={isActive ? "Disable Touchless Scrolling" : "Activate Touchless Scrolling"}
            data-cursor="interactive"
          >
            {isActive ? (
              /* CAM / RECORDING ICON REPRESENTATION */
              <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
                {CAM_PIXELS.map((p, i) => (
                  <div
                    key={`cam-${i}`}
                    className={`w-full h-full ${
                      p === 1 ? "bg-[#FF3B30] transition-colors duration-300" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            ) : (
              /* HAND SENSOR TARGET ICON */
              <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
                {HAND_PIXELS.map((p, i) => (
                  <div
                    key={`hand-${i}`}
                    className={`w-full h-full ${
                      p === 1 ? "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </button>

          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 px-2 select-none">
            {isActive ? "HAND_NAV: ON" : "HAND_NAV: OFF"}
          </span>

          {isActive && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[9px] hover:text-[#FF3B30] text-zinc-500 font-mono tracking-wider px-2 border-l border-zinc-850"
            >
              {isMinimized ? "SHOW" : "HIDE"}
            </button>
          )}

          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="text-[9px] hover:text-[#FF3B30] text-zinc-500 font-mono tracking-wider px-2 border-l border-zinc-850 cursor-pointer select-none"
            title="Toggle Gesture Control Guide (Press G)"
            data-cursor="interactive"
          >
            GUIDE [G]
          </button>
        </div>

        {/* Floating active webcam preview lens panel container */}
        {isActive && !isMinimized && (
          <div className="w-64 border border-zinc-800 bg-[#0c0c0e] shadow-2xl p-1.5 flex flex-col gap-1.5 keep-dark">
            <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 border-b border-zinc-900 pb-1 px-1">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${handDetected ? "bg-emerald-500 animate-pulse" : "bg-[#FF3B30] animate-ping"}`}></span>
                {handDetected ? "HAND ACQUIRED" : "ALIGNING..."}
              </span>
              <span>{fps} FPS</span>
            </div>

            <div className="relative aspect-video bg-black overflow-hidden border border-zinc-900">
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full scale-x-[-1] pointer-events-none"
              />

              {/* Micro-loading spinner mask overlay */}
              {loadingText && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-3 text-center space-y-1">
                  <div className="w-4 h-4 border border-t-[#FF3B30] border-zinc-800 rounded-full animate-spin"></div>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">{loadingText}</span>
                </div>
              )}

              {/* Dynamic UI Debug indicator for easy timing optimization */}
              {scrollDirection !== "STATIONARY" && (
                <div
                  className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-bold text-white shadow-md transition-all ${
                    scrollDirection === "COOLING_DOWN"
                      ? "bg-amber-600 animate-pulse border border-amber-400"
                      : scrollDirection.startsWith("SWIPE")
                      ? "bg-[#FF3B30] border border-[#ff6961]"
                      : "bg-emerald-650"
                  }`}
                >
                  {scrollDirection === "COOLING_DOWN" && "COOLING DOWN..."}
                  {scrollDirection === "SWIPE_DETECTED_DOWN" && "SWIPE DETECTED // DOWN"}
                  {scrollDirection === "SWIPE_DETECTED_UP" && "SWIPE DETECTED // UP"}
                </div>
              )}
            </div>

            {/* Quick interactive user tutorials tips inside mini radar dock */}
            <div className="text-[8px] font-mono text-zinc-500 leading-normal px-2 bg-black/40 py-1.5 border border-zinc-900">
              {scrollDirection === "COOLING_DOWN" ? (
                <span className="text-amber-500 font-bold">🚫 COOLING DOWN // SWIPE RESET COOLDOWN IN PROGRESS</span>
              ) : scrollDirection.startsWith("SWIPE") ? (
                <span className="text-[#FF3B30] font-bold">🎯 SWIPE DETECTED // EXECUTING FIXED INTERACTION SCROLL</span>
              ) : handDetected ? (
                <span className="text-zinc-400">⚡ SWIPE HAND UP RAPIDLY TO SCROLL DOWN, OR DOWN TO SCROLL UP.</span>
              ) : (
                <span>💡 ALIGN HAND IN FRONT OF WEB CAMERA TO TEST TOUCHLESS NAV.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* High-Contrast Interactive Virtual Mouse Pointer */}
      {isActive && (
        <div
          ref={virtualCursorRef}
          className={`fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center transition-all duration-150 ${
            handDetected ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{
            width: isClicked ? "14px" : (isHovering ? "28px" : "20px"),
            height: isClicked ? "14px" : (isHovering ? "28px" : "20px"),
            border: isClicked 
              ? "3px solid #FF3B30" 
              : (isHovering ? "2px solid #FF3B30" : "1.5px solid rgba(255, 255, 255, 0.8)"),
            boxShadow: isClicked
              ? "0 0 20px #FF3B30, inset 0 0 10px #FF3B30"
              : (isHovering 
                ? "0 0 12px rgba(255, 59, 48, 0.8), inset 0 0 6px rgba(255, 59, 48, 0.4)" 
                : "0 0 6px rgba(0, 0, 0, 0.5)"),
            backgroundColor: isClicked ? "#FF3B30" : (isHovering ? "rgba(255, 59, 48, 0.15)" : "rgba(0, 0, 0, 0.15)"),
            top: 0,
            left: 0,
            transform: `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0)`,
            transition: "width 0.1s ease, height 0.1s ease, border-color 0.1s ease, background-color 0.1s ease",
            margin: isClicked ? "-7px 0 0 -7px" : (isHovering ? "-14px 0 0 -14px" : "-10px 0 0 -10px"),
          }}
        >
          {/* Inner solid high-precision tracking dot core */}
          <div 
            className={`w-1.5 h-1.5 rounded-full ${
              isClicked ? "bg-white scale-75" : (isHovering ? "bg-[#FF3B30] scale-125" : "bg-white")
            } transition-all duration-100`}
          />
        </div>
      )}

      {/* Futuristic Carbon-Dark Hand Interaction Guide Modal */}
      {isGuideOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsGuideOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 shadow-2xl flex flex-col gap-6 text-white text-left font-sans animate-zoom-in max-h-[90vh] overflow-y-auto keep-dark"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header section with telemetry-inspired design */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3B30] uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
                  SPATIAL CALIBRATION PANEL
                </span>
                <h3 className="font-sans font-semibold tracking-tight text-lg text-zinc-100 uppercase">
                  Touchless Gesture Navigation
                </h3>
              </div>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-zinc-500 hover:text-white hover:border-[#FF3B30] transition-colors text-[9px] font-mono px-2 py-1 border border-zinc-850 bg-black/60 cursor-pointer select-none"
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Instruction Grid */}
            <div className="flex flex-col gap-5">
              
              {/* Step 1: Cursor movement */}
              <div className="group flex flex-col md:flex-row items-start gap-4 p-3 border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 border border-zinc-900 bg-black/40 flex items-center justify-center relative overflow-hidden">
                  {/* Visual tracking simulation icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                    <div className="w-8 h-8 rounded-full border border-dashed border-zinc-700 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-[0_0_8px_#FF3B30] animate-pulse" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    01 // NATURAL VIRTUAL CURSOR
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Align your hand in clear view of the camera. The system maps your <strong className="text-[#FF3B30]">Index Finger Tip</strong> (Landmark 8) to physical screen coordinates. Point naturally to move the cursor.
                  </p>
                </div>
              </div>

              {/* Step 2: Click gesture */}
              <div className="group flex flex-col md:flex-row items-start gap-4 p-3 border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 border border-zinc-900 bg-black/40 flex items-center justify-center relative overflow-hidden">
                  {/* Interactive simulated pinch dot feedback */}
                  <div className="absolute w-6 h-6 rounded-full border border-zinc-850 animate-ping opacity-40" />
                  <div className="flex items-center gap-[1px]">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_4px_#FF3B30]" />
                    <div className="w-1 h-[1px] bg-dashed bg-zinc-600" />
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    02 // PINCH-TO-CLICK INTERACTION
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Touch your <strong className="text-[#FF3B30]">Thumb</strong> and <strong className="text-[#FF3B30]">Index Finger</strong> tips together. A tight 3D distance check triggers standard hover clicking, followed by an immediate visual feedback ripple.
                  </p>
                </div>
              </div>

              {/* Step 3: Swipe gesture */}
              <div className="group flex flex-col md:flex-row items-start gap-4 p-3 border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 border border-zinc-900 bg-black/40 flex items-center justify-center relative overflow-hidden flex-col gap-0.5">
                  {/* Swipe Direction arrows */}
                  <span className="text-[10px] font-bold text-[#FF3B30] animate-bounce">▲</span>
                  <span className="text-[10px] font-bold text-zinc-500 animate-bounce" style={{ animationDelay: '0.2s' }}>▼</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    03 // EXECUTING KINETIC SCROLLING
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Swipe your hand <strong className="text-zinc-100">UP</strong> rapidly to scroll the page <span className="text-amber-500 font-medium">DOWN</span>, or swipe <strong className="text-zinc-100">DOWN</strong> to scroll <span className="text-amber-500 font-medium">UP</span>. Ensure you wait out the orange cooling rest interval.
                  </p>
                </div>
              </div>

            </div>

            {/* Micro instructions / shortcuts footnote */}
            <div className="mt-2 p-3 bg-zinc-950/50 border border-zinc-900 text-[10px] text-zinc-500 leading-normal font-mono flex items-center justify-between">
              <span>SHORTCUT: PRESS <kbd className="px-1.5 py-0.5 bg-zinc-900 text-[#FF3B30] border border-zinc-800 rounded font-bold">G</kbd> ON KEYBOARD</span>
              <span>ESC DISMISSAL SUPPORTED</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
