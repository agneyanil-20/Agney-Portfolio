/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import {
  HandGestureController,
  DEBUG_HAND_TRACKING,
  type GestureDebugInfo,
} from "../utils/HandGestureController";
import { X, RefreshCw } from "lucide-react";

// Pixel art icons for hand motion gesture toggle and theme switches
const HAND_PIXELS = [
  0, 0, 1, 1, 0, 0, 0, 0,
  0, 1, 0, 0, 1, 0, 0, 0,
  0, 1, 0, 0, 1, 0, 0, 0,
  0, 0, 1, 1, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  0, 1, 1, 1, 1, 1, 1, 0
];

const SUN_PIXELS = [
  0, 0, 1, 0, 0, 1, 0, 0,
  0, 0, 0, 1, 1, 0, 0, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 0, 0, 1, 1, 0, 0, 0,
  0, 0, 1, 0, 0, 1, 0, 0
];

const MOON_PIXELS = [
  0, 0, 1, 1, 1, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 0, 0,
  1, 1, 1, 1, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 1, 1, 1, 0, 0, 0
];

interface HandScrollNavProps {
  theme?: "dark" | "light";
  setTheme?: (theme: "dark" | "light") => void;
}

export default function HandScrollNav({ theme, setTheme }: HandScrollNavProps) {
  const [isActive, setIsActive] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [handDetected, setHandDetected] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Telemetry state (only utilized if DEBUG_HAND_TRACKING is true)
  const [debugInfo, setDebugInfo] = useState<GestureDebugInfo>({
    isActive: false,
    handDetected: false,
    gesture: "idle",
    fingerCount: 0,
    cursor: {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    },
    pinchState: "OPEN",
    pinchRatio: 1.0,
    scrollDelta: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const handCursorRef = useRef<HTMLDivElement>(null);

  // Gesture controller engine
  const gestureControllerRef = useRef<HandGestureController | null>(null);

  // Initialize gesture controller
  useEffect(() => {
    gestureControllerRef.current = new HandGestureController((info) => {
      if (DEBUG_HAND_TRACKING) {
        setDebugInfo(info);
      }
    });

    if (handCursorRef.current) {
      gestureControllerRef.current.bindCursorElement(handCursorRef.current);
    }

    return () => {
      gestureControllerRef.current?.destroy();
    };
  }, []);

  // Bind cursor element whenever isActive toggles and element renders
  useEffect(() => {
    if (gestureControllerRef.current && handCursorRef.current) {
      gestureControllerRef.current.bindCursorElement(handCursorRef.current);
    }
  }, [isActive]);

  // Handle keyboard shortcut [G] and [Escape] to toggle gesture guide overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable);
      if (isInput) return;

      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        setIsGuideOpen((prev) => !prev);
      } else if (e.key === "Escape" && isGuideOpen) {
        setIsGuideOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGuideOpen]);

  // Initialize MediaPipe HandLandmarker when turning active
  const startTracking = async () => {
    try {
      setCameraError(null);
      setLoadingText("Starting sensor...");

      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );

        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.65,
          minHandPresenceConfidence: 0.65,
          minTrackingConfidence: 0.65,
        });
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera is unavailable or disabled in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setLoadingText("");
          animationFrameRef.current = requestAnimationFrame(predictFrameLoop);
        };
      }
    } catch (err: any) {
      const errName = err?.name || "";
      const errMsg = err?.message || "";
      const isPermissionDenied =
        errName === "NotAllowedError" ||
        errName === "PermissionDeniedError" ||
        errName === "SecurityError" ||
        errMsg.toLowerCase().includes("permission") ||
        errMsg.toLowerCase().includes("denied");

      const friendlyMsg = isPermissionDenied
        ? "Camera access blocked. Please enable camera in browser settings."
        : "Camera unavailable.";

      console.warn("Touchless camera notice:", friendlyMsg);
      setCameraError(friendlyMsg);
      setLoadingText("");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const stopTracking = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    gestureControllerRef.current?.destroy();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHandDetected(false);
    setLoadingText("");
  };

  const handleToggle = () => {
    if (isActive || cameraError) {
      stopTracking();
      setCameraError(null);
      setIsActive(false);
    } else {
      setCameraError(null);
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

    if (video.readyState >= 2) {
      const timestamp = performance.now();
      const results = landmarker.detectForVideo(video, timestamp);

      if (canvas) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks && results.landmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.landmarks[0];

            // Render clean, minimal hand skeleton (thin lines, tiny dots)
            drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);

            // Process touchless gestures
            gestureControllerRef.current?.processLandmarks(landmarks);
          } else {
            setHandDetected(false);
            gestureControllerRef.current?.handleHandLost();
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictFrameLoop);
  };

  // Clean, minimal skeleton rendering (thin lines, tiny dots, no glow)
  const drawHandSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = "rgba(255, 59, 48, 0.45)";
    ctx.lineWidth = 1.2;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17],
    ];

    connections.forEach(([i1, i2]) => {
      const p1 = landmarks[i1];
      const p2 = landmarks[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    });

    // Small subtle node dots (radius ~2px)
    landmarks.forEach((p, idx) => {
      ctx.beginPath();
      const r = idx === 8 || idx === 4 ? 2.5 : 1.8;
      ctx.arc(p.x * width, p.y * height, r, 0, 2 * Math.PI);
      ctx.fillStyle = idx === 8 ? "#ffffff" : "#FF3B30";
      ctx.fill();
    });
  };

  return (
    <>
      {/* Top Right Controls Group: Theme Switch & Hand Gesture Switch */}
      <div
        className={`fixed top-6 z-50 flex items-center gap-2 transition-all duration-300 ${
          isActive || cameraError
            ? "right-[248px] sm:right-[268px] md:right-[280px]"
            : "right-6 md:right-12"
        }`}
      >
        {/* Hand Motion Gesture Trigger (Icon Only) */}
        <button
          onClick={handleToggle}
          className={`group focus:outline-none p-1.5 border ${
            isActive
              ? "border-[#FF3B30] bg-[#140808] shadow-[0_0_10px_rgba(255,59,48,0.35)]"
              : "border-zinc-800 hover:border-[#FF3B30] bg-[#0c0c0c]"
          } shadow-lg rounded-none transition-all duration-300 cursor-pointer select-none keep-dark`}
          title={isActive ? "Disable Hand Navigation" : "Enable Touchless Hand Navigation"}
          data-cursor="interactive"
        >
          <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
            {HAND_PIXELS.map((p, i) => (
              <div
                key={`hand-${i}`}
                className={`w-full h-full ${
                  p === 1
                    ? isActive
                      ? "bg-[#FF3B30]"
                      : "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </button>

        {/* Theme Switcher Button */}
        {setTheme && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group focus:outline-none p-1.5 border border-zinc-800 hover:border-[#FF3B30] bg-[#0c0c0c] shadow-lg rounded-none transition-all duration-300 cursor-pointer select-none theme-toggle keep-dark"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            data-cursor="interactive"
          >
            {theme === "dark" ? (
              <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
                {SUN_PIXELS.map((p, i) => (
                  <div
                    key={`sun-${i}`}
                    className={`w-full h-full ${
                      p === 1
                        ? "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
                {MOON_PIXELS.map((p, i) => (
                  <div
                    key={`moon-${i}`}
                    className={`w-full h-full ${
                      p === 1
                        ? "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </button>
        )}
      </div>

      {/* Floating Glassmorphic Camera Widget (Fixed at top: 24px, right: 24px) */}
      {(isActive || cameraError) && (
        <div
          className="fixed top-6 right-6 z-50 w-[220px] sm:w-[240px] md:w-[256px] aspect-video rounded-[18px] overflow-hidden border border-white/15 bg-black/40 backdrop-blur-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 group"
          style={{ WebkitBackdropFilter: "blur(18px)" }}
        >
          {cameraError ? (
            /* Minimal glass error state */
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-black/60">
              <span className="text-[10px] text-zinc-300 leading-tight mb-2">
                {cameraError}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCameraError(null);
                    startTracking();
                  }}
                  className="px-2 py-1 text-[9px] font-mono uppercase font-bold bg-[#FF3B30] text-black rounded flex items-center gap-1 cursor-pointer hover:bg-white transition-colors"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Retry
                </button>
                <button
                  onClick={() => {
                    setCameraError(null);
                    setIsActive(false);
                  }}
                  className="px-2 py-1 text-[9px] font-mono uppercase bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            /* Minimal Camera Lens Viewport */
            <div className="relative w-full h-full bg-black/50 overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none"
              />

              {/* Minimal Loading Spinner */}
              {loadingText && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 text-center">
                  <div className="w-4 h-4 border-2 border-t-[#FF3B30] border-white/20 rounded-full animate-spin mb-1.5" />
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                    {loadingText}
                  </span>
                </div>
              )}

              {/* Subtle Hand Detected Dot Indicator */}
              <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    handDetected
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                      : "bg-white/30 animate-pulse"
                  }`}
                />
              </div>

              {/* Subtle Glass Close Button (visible on widget hover) */}
              <button
                onClick={() => {
                  setIsActive(false);
                  setCameraError(null);
                }}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10 cursor-pointer"
                title="Stop Hand Navigation"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Developer-only debug overlay - hidden in normal usage */}
          {DEBUG_HAND_TRACKING && (
            <div className="absolute bottom-0 inset-x-0 bg-black/85 p-1.5 text-[7px] font-mono text-zinc-400 flex justify-between border-t border-zinc-900">
              <span>{debugInfo.gesture.toUpperCase()}</span>
              <span>{debugInfo.fingerCount}F</span>
              <span>
                {debugInfo.cursor.x},{debugInfo.cursor.y}
              </span>
              <span>{debugInfo.pinchState}</span>
            </div>
          )}
        </div>
      )}

      {/* Touchless Virtual Hand Cursor */}
      {isActive && <div id="hand-cursor" ref={handCursorRef} />}

      {/* Spatial Calibration / Gesture Guide Modal (Accessible via [G] key) */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsGuideOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0c0c0e] border border-white/15 p-6 rounded-2xl shadow-2xl flex flex-col gap-5 text-white text-left font-sans animate-zoom-in max-h-[90vh] overflow-y-auto keep-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#FF3B30] uppercase font-bold">
                  GESTURE CALIBRATION
                </span>
                <h3 className="font-semibold text-base text-zinc-100 uppercase mt-0.5">
                  Touchless Controls
                </h3>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-zinc-400 hover:text-white text-[10px] font-mono px-2 py-1 border border-zinc-800 bg-zinc-900 rounded cursor-pointer"
              >
                [ESC]
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="p-3 border border-zinc-900 bg-zinc-950/40 rounded-lg flex items-start gap-3">
                <span className="text-lg">☝️</span>
                <div className="flex flex-col">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-200">
                    Point: Virtual Cursor
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                    Extend your index finger with other fingers folded. The cursor follows your fingertip across the entire viewport.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-zinc-900 bg-zinc-950/40 rounded-lg flex items-start gap-3">
                <span className="text-lg">🤏</span>
                <div className="flex flex-col">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-200">
                    Pinch: Click Element
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                    Touch your thumb and index fingertip together. Dispatches a single click on the element under the cursor.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-zinc-900 bg-zinc-950/40 rounded-lg flex items-start gap-3">
                <span className="text-lg">🖐️</span>
                <div className="flex flex-col">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-200">
                    3+ Fingers: Rotation Scroll
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                    Show 3 or more open fingers and rotate your hand like turning a dial. Rotate <strong>CLOCKWISE</strong> to scroll DOWN, or <strong>ANTI-CLOCKWISE</strong> to scroll UP.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between border-t border-zinc-900 pt-3">
              <span>KEYBOARD SHORTCUT: <kbd className="text-[#FF3B30] font-bold">G</kbd></span>
              <span>PRESS ESC TO CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
