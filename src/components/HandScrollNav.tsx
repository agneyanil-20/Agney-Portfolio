/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { HandGestureController, GestureDebugInfo } from "../utils/HandGestureController";

// Beautiful custom pixel art icons matching the Moon & Sun toggle
const HAND_PIXELS = [
  0, 1, 0, 1, 0, 1, 0, 0,
  0, 1, 0, 1, 0, 1, 0, 0,
  1, 1, 1, 1, 1, 1, 0, 0,
  1, 1, 1, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 1, 1, 0, 0, 0
];

const SUN_PIXELS = [
  0, 0, 1, 0, 0, 1, 0, 0,
  0, 1, 0, 1, 1, 0, 1, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 1, 0, 1, 1, 0, 1, 0,
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [statusText, setStatusText] = useState("Off");
  const [loadingText, setLoadingText] = useState("");
  const [handDetected, setHandDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Real-time debug telemetry state
  const [debugInfo, setDebugInfo] = useState<GestureDebugInfo>({
    isActive: false,
    handDetected: false,
    gesture: "idle",
    fingerCount: 0,
    cursor: { x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 },
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

  const fpsFrameCountRef = useRef<number>(0);
  const fpsLastTimeRef = useRef<number>(0);

  // Initialize gesture controller
  useEffect(() => {
    gestureControllerRef.current = new HandGestureController((info) => {
      setDebugInfo(info);
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
      setStatusText("Initializing");
      setLoadingText("Loading WASM module...");

      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );

        setLoadingText("Loading AI model...");
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
      }

      setLoadingText("Accessing camera...");

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Webcam access is not supported or disabled in this browser context.");
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
          setStatusText("Active");
          fpsLastTimeRef.current = performance.now();
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
        ? "Camera permission denied. Please grant camera access in your browser or address bar settings to use touchless gesture navigation."
        : errMsg || "Camera access failed or device is currently unavailable.";

      console.warn("Hand sensor camera notice:", friendlyMsg);
      setCameraError(friendlyMsg);
      setStatusText("Error");
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
    setStatusText("Off");
    setHandDetected(false);
    setLoadingText("");
  };

  // Switch state hand navigation trigger
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
            setFps(
              Math.round(
                (fpsFrameCountRef.current * 1000) / (timestamp - fpsLastTimeRef.current)
              )
            );
            fpsFrameCountRef.current = 0;
            fpsLastTimeRef.current = timestamp;
          }

          if (results.landmarks && results.landmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.landmarks[0];

            // Draw skeleton landmarks in red
            drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);

            // Process touchless gestures through HandGestureController
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
      <div className="fixed top-6 right-6 md:top-8 md:right-12 z-50 flex flex-col items-end gap-2">
        {/* Top Right Controls Group: Hand Motion Gesture & Theme Switch */}
        <div className="flex items-center gap-2">
          {/* Hand Motion Gesture Trigger (Icon Only) */}
          <button
            onClick={handleToggle}
            className={`group focus:outline-none p-1.5 border ${
              isActive
                ? "border-[#FF3B30] bg-[#140808] shadow-[0_0_12px_rgba(255,59,48,0.35)]"
                : "border-zinc-800 hover:border-[#FF3B30] bg-[#0c0c0c]"
            } shadow-lg rounded-none transition-all duration-300 cursor-pointer select-none keep-dark`}
            title={isActive ? "Disable Hand Gesture Control" : "Enable Touchless Hand Gesture Navigation"}
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

        {/* Floating active webcam preview lens panel or error container */}
        {(isActive || cameraError) && !isMinimized && (
          <div className="w-68 md:w-72 border border-zinc-800 bg-[#0c0c0e] shadow-2xl p-2 flex flex-col gap-2 keep-dark animate-fade-in mt-1">
            <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 border-b border-zinc-900 pb-1 px-1">
              <span className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    cameraError
                      ? "bg-[#FF3B30]"
                      : handDetected
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-amber-500 animate-ping"
                  }`}
                />
                {cameraError ? "CAMERA ACCESS BLOCKED" : handDetected ? "HAND ACQUIRED" : "ALIGNING..."}
              </span>
              <div className="flex items-center gap-2">
                {!cameraError && <span>{fps} FPS</span>}
                <button
                  onClick={() => setShowDebugPanel((prev) => !prev)}
                  className={`hover:text-[#FF3B30] transition-colors text-[8px] font-mono ${
                    showDebugPanel ? "text-[#FF3B30] font-bold" : "text-zinc-500"
                  }`}
                  title="Toggle Debug Telemetry Panel"
                >
                  [DEBUG]
                </button>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="hover:text-[#FF3B30] transition-colors text-zinc-400"
                  title="Gesture Guide"
                >
                  [G]
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setCameraError(null);
                  }}
                  className="hover:text-[#FF3B30] transition-colors text-zinc-400"
                  title="Close Widget"
                >
                  [CLOSE]
                </button>
              </div>
            </div>

            {cameraError ? (
              <div className="p-3 bg-[#180808] border border-[#FF3B30]/40 flex flex-col gap-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-[#FF3B30] text-xs font-mono font-bold">⚠️</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase font-bold text-[#FF3B30] tracking-wider">
                      Permission Required
                    </span>
                    <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                      {cameraError}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-zinc-900">
                  <button
                    onClick={() => {
                      setCameraError(null);
                      if (isActive) {
                        startTracking();
                      } else {
                        setIsActive(true);
                      }
                    }}
                    className="bg-[#FF3B30] hover:bg-white text-black font-mono text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Retry Access
                  </button>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      setIsActive(false);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono text-[9px] px-2.5 py-1 border border-zinc-800 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
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
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                      {loadingText}
                    </span>
                  </div>
                )}

                {/* Active Gesture Mode HUD badge */}
                {debugInfo.handDetected && (
                  <div
                    className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-bold text-white shadow-md transition-all ${
                      debugInfo.gesture === "pinch"
                        ? "bg-[#FF3B30] border border-[#ff6961] animate-pulse"
                        : debugInfo.gesture === "scroll"
                        ? "bg-amber-600 border border-amber-400"
                        : debugInfo.gesture === "pointer"
                        ? "bg-emerald-650 border border-emerald-500"
                        : "bg-zinc-800 border border-zinc-700"
                    }`}
                  >
                    {debugInfo.gesture === "pointer" && "POINTER [1 FINGER]"}
                    {debugInfo.gesture === "pinch" && "PINCH // CLICK"}
                    {debugInfo.gesture === "scroll" && "SCROLL [3+ FINGERS]"}
                    {debugInfo.gesture === "idle" && "IDLE"}
                  </div>
                )}
              </div>
            )}

            {!cameraError && showDebugPanel && (
              <div className="text-[8px] font-mono text-zinc-400 leading-normal px-2.5 bg-black/60 py-2 border border-zinc-900 flex flex-col gap-1 select-none">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500 uppercase font-bold tracking-wider">GESTURE ENGINE</span>
                  <span
                    className={`px-1 rounded text-[7px] font-bold ${
                      debugInfo.handDetected ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {debugInfo.handDetected ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MODE:</span>
                    <span
                      className={`font-bold uppercase ${
                        debugInfo.gesture === "pointer"
                          ? "text-emerald-400"
                          : debugInfo.gesture === "pinch"
                          ? "text-[#FF3B30]"
                          : debugInfo.gesture === "scroll"
                          ? "text-amber-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {debugInfo.gesture}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">FINGERS:</span>
                    <span className="font-bold text-zinc-300">{debugInfo.fingerCount} EXTENDED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">CURSOR:</span>
                    <span className="font-mono text-zinc-300">
                      {Math.round(debugInfo.cursor.x)}, {Math.round(debugInfo.cursor.y)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PINCH:</span>
                    <span
                      className={`font-bold ${
                        debugInfo.pinchState === "PINCHING" ? "text-[#FF3B30]" : "text-zinc-400"
                      }`}
                    >
                      {debugInfo.pinchState} ({(debugInfo.pinchRatio * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                {debugInfo.gesture === "scroll" && Math.abs(debugInfo.scrollDelta) > 0.001 && (
                  <div className="flex justify-between text-[7.5px] pt-0.5 border-t border-zinc-900/60 text-amber-400">
                    <span>KINETIC SCROLL:</span>
                    <span>{debugInfo.scrollDelta > 0 ? "SCROLLING DOWN ↓" : "SCROLLING UP ↑"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Touchless Virtual Pointer (controlled by HandGestureController) */}
      {isActive && <div id="hand-cursor" ref={handCursorRef} />}

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
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                    <div className="w-8 h-8 rounded-full border border-dashed border-zinc-700 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-[0_0_8px_#FF3B30] animate-pulse" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    01 // ☝️ INDEX FINGER: NATURAL VIRTUAL CURSOR
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Extend your <strong className="text-[#FF3B30]">Index Finger</strong> with other fingers curled into your palm. The system maps your index fingertip to physical viewport coordinates with edge margin scaling so you can reach all corners comfortably.
                  </p>
                </div>
              </div>

              {/* Step 2: Click gesture */}
              <div className="group flex flex-col md:flex-row items-start gap-4 p-3 border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 border border-zinc-900 bg-black/40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute w-6 h-6 rounded-full border border-zinc-850 animate-ping opacity-40" />
                  <div className="flex items-center gap-[1px]">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_4px_#FF3B30]" />
                    <div className="w-1 h-[1px] bg-dashed bg-zinc-600" />
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    02 // 🤏 PINCH-TO-CLICK INTERACTION
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    While pointing, touch your <strong className="text-[#FF3B30]">Thumb</strong> and <strong className="text-[#FF3B30]">Index Finger</strong> tips together. The cursor freezes in place to neutralize jitter, dispatches a genuine click to the element underneath, and produces an expanding ripple indicator.
                  </p>
                </div>
              </div>

              {/* Step 3: 3+ Finger Scroll gesture */}
              <div className="group flex flex-col md:flex-row items-start gap-4 p-3 border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 border border-zinc-900 bg-black/40 flex items-center justify-center relative overflow-hidden flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-[#FF3B30] animate-bounce">▲</span>
                  <span className="text-[10px] font-bold text-zinc-500 animate-bounce" style={{ animationDelay: '0.2s' }}>▼</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    03 // 🖐️ 3+ FINGERS: FLUID KINETIC SCROLLING
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Open your hand with <strong className="text-zinc-100">3 or more fingers extended</strong> (e.g. open palm). Moving your hand up or down continuously scrolls the webpage smoothly with deadzone filtering and inertial momentum.
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
