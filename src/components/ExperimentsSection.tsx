/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { Sparkles, Sun, Shuffle, Play, RefreshCw } from "lucide-react";

export default function ExperimentsSection() {
  const [activeTab, setActiveTab] = useState<string>("gravity-particles");

  return (
    <section 
      id="explorations" 
      className="min-h-screen w-full bg-black text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-4">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
              explorations
            </h2>
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
              / ACTIVE CREATIVE CODING SCRATCHPAD
            </div>
          </div>
        </div>

        {/* Modular Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Explorer Lab Menu */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="font-mono text-zinc-500 text-xs tracking-widest uppercase">// MODULE SELECTION</span>
            
            <div className="flex flex-col gap-3">
              {PORTFOLIO_DATA.explorations.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-6 border rounded-sm transition-all duration-300 select-none cursor-pointer focus:outline-none ${
                      isActive 
                        ? "bg-zinc-950 border-[#FF3B30] text-white shadow-xl shadow-[#FF3B30]/5" 
                        : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-white"
                    }`}
                  >
                    <span className={`font-mono text-[10px] block mb-2 ${isActive ? "text-[#FF3B30]" : "text-zinc-600"}`}>
                      {isActive ? "ACTIVE MODULE // RUNNING" : "LAID OVER // IDLE"}
                    </span>
                    <h3 className="font-display font-bold text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-xs leading-relaxed font-light">
                      {item.description}
                    </p>
                    <div className="mt-4 font-mono text-[9px] uppercase tracking-wider text-zinc-400 border-t border-zinc-900 pt-3 flex items-center justify-between">
                      <span>ENGINE: {item.tech}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Playground Render Window */}
          <div className="lg:col-span-8 bg-[#030303] border border-zinc-900 p-6 md:p-8 rounded-sm min-h-[500px] flex flex-col justify-between relative group shadow-sm">
            
            {/* Top Lab Statistics Header */}
            <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 border-b border-zinc-900 pb-4 mb-6">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#FF3B30] animate-spin" /> LIVE MODULE INTEGRATION</span>
              <span>RENDERRATE: 60FPS</span>
            </div>

            {/* Dynamic Rendering Canvas based on active tab */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden min-h-[350px]">
              <AnimatePresence mode="wait">
                {activeTab === "gravity-particles" && <GravityCanvasExperiment key="gravity-particles" />}
                {activeTab === "kinetic-typography" && <KineticTypographyExperiment key="kinetic-typography" />}
                {activeTab === "diurnal-monolith" && <MonolithShadowExperiment key="diurnal-monolith" />}
              </AnimatePresence>
            </div>

            {/* Lab Footer */}
            <div className="flex justify-between items-end border-t border-zinc-900 pt-4 mt-6 text-[10px] font-mono text-zinc-600 uppercase tracking-tight">
              <span>Status: Safe Web Sandbox</span>
              <span>Coordinates: Local Sandbox API</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ==============================================
   LAB WIDGET 1: Coordinate Gravity Canvas
   ============================================== */
function GravityCanvasExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
    }> = [];

    const init = () => {
      const width = containerRef.current?.clientWidth || 500;
      const height = 300;
      canvas.width = width;
      canvas.height = height;

      particles = [];
      const density = 25; // Grid spacing
      
      for (let y = 30; y < height - 30; y += density) {
        for (let x = 30; x < width - 30; x += density) {
          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            size: 1 + Math.random() * 2,
            color: "rgba(255, 255, 255, 0.45)",
            vx: 0,
            vy: 0
          });
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Distance math
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 90;

        // Accelerate back to baseline
        const homeDx = p.baseX - p.x;
        const homeDy = p.baseY - p.y;
        p.vx += homeDx * 0.08;
        p.vy += homeDy * 0.08;

        // Apply friction
        p.vx *= 0.82;
        p.vy *= 0.82;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          // Pull direction based on force
          const pullAngle = Math.atan2(dy, dx);
          const pullForceX = Math.cos(pullAngle) * force * 4.5;
          const pullForceY = Math.sin(pullAngle) * force * 4.5;

          // Push or pull
          p.vx -= pullForceX;
          p.vy -= pullForceY;
          p.color = "rgba(255, 59, 48, 0.95)";
        } else {
          p.color = "rgba(255, 255, 255, 0.55)";
        }

        // Apply velocity vectors
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle nodes
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect near particles using faint line webbing
        particles.forEach((otherP) => {
          if (p === otherP) return;
          const odx = p.x - otherP.x;
          const ody = p.y - otherP.y;
          const odist = Math.sqrt(odx * odx + ody * ody);

          if (odist < 24) {
            ctx.strokeStyle = p.color === "rgba(255, 59, 48, 0.95)" 
              ? "rgba(255, 59,  red, 0.08)" 
              : "rgba(255, 255, 255, 0.04)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(otherP.x, otherP.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Watch resizing
    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      className="w-full h-full flex flex-col justify-center items-center gap-4 relative"
    >
      <canvas ref={canvasRef} className="w-full max-w-full bg-[#020202] border border-zinc-950 rounded cursor-crosshair h-[300px]" />
      <span className="font-mono text-[9px] text-[#FF3B30] uppercase tracking-widest animate-pulse">
        [Move cursor over the lattice to trigger coordinate gravitational pull]
      </span>
    </motion.div>
  );
}

/* ==============================================
   LAB WIDGET 2: Liquid Typography Distorter
   ============================================== */
function KineticTypographyExperiment() {
  const [inputText, setInputText] = useState("CREATIVE");
  const [liquidity, setLiquidity] = useState(12);
  const [velocity, setVelocity] = useState(0);

  // Cycle letters animation effect using direct React local interval clocks
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setVelocity(Math.sin(tick * 0.15) * liquidity);
    }, 40);
    return () => clearInterval(interval);
  }, [liquidity]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center justify-between gap-8 py-3"
    >
      {/* Visual Text Output */}
      <div className="w-full flex justify-center items-center py-6 min-h-[140px] border border-zinc-950 bg-[#020202] rounded relative">
        <div className="font-display font-black tracking-[12px] md:tracking-[20px] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center select-none flex justify-center items-center">
          {inputText.split("").map((letter, idx) => {
            // Apply different wave offset factors to each character to achieve full liquid distortion
            const yOffset = Math.sin(idx * 0.75 + velocity * 0.1) * (liquidity * 1.5);
            const xOffset = Math.cos(idx * 0.5 + velocity * 0.1) * (liquidity * 0.6);
            const skewVal = Math.sin(idx * 1.2 + velocity * 0.08) * (liquidity * 1);
            
            return (
              <span 
                key={idx}
                className="inline-block transition-transform duration-75 select-none"
                style={{
                  transform: `translate(${xOffset}px, ${yOffset}px) skewX(${skewVal}deg)`,
                  color: idx % 3 === 0 ? "#FF3B30" : "#FFFFFF",
                  textShadow: liquidity > 15 ? `0 0 ${liquidity / 3}px rgba(255, 59, 48, 0.4)` : "none"
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>

      {/* Controller Controls */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-950 pt-5 text-left">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">COMPILE DATA STRING</label>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toUpperCase().slice(0, 14))}
            maxLength={14}
            className="w-full bg-zinc-950 border border-zinc-900 rounded px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#FF3B30]"
            placeholder="TYPE CONTEXT"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            <span>LIQUIDITY POWER ({liquidity}px)</span>
          </div>
          <input 
            type="range"
            min="0"
            max="30"
            step="1"
            value={liquidity}
            onChange={(e) => setLiquidity(Number(e.target.value))}
            className="w-full accent-[#FF3B30] bg-zinc-950 cursor-pointer py-2 h-4 rounded"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ==============================================
   LAB WIDGET 3: Procedural Shadow Play
   ============================================== */
function MonolithShadowExperiment() {
  const [timeOfDay, setTimeOfDay] = useState(13); // Hours, 4:00 to 20:00

  // Calculate trigonometry values for realistic shadow casting
  const getShadowPathProps = () => {
    // Solar angle conversion (Hours mapped to range [-PI/2, PI/2])
    const tRad = ((timeOfDay - 12) / 8) * (Math.PI / 2.3);
    
    // Shadow length factor
    const scalarX = Math.sin(tRad) * 45;
    const scalarY = Math.cos(tRad) * 22 + 4; // Flat ground constraint

    return {
      sx: scalarX,
      sy: scalarY,
      opacity: Math.max(0.2, 0.95 - Math.abs(timeOfDay - 12) * 0.1) // Dimmer shadows at solar noon
    };
  };

  const { sx, sy, opacity } = getShadowPathProps();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center justify-between gap-6 py-3"
    >
      {/* 2D Isometric Brutalist Monolith Projection Canvas */}
      <div className="w-full aspect-[16/9] max-h-[220px] bg-[#020202] border border-zinc-950 rounded relative overflow-hidden flex items-center justify-center">
        
        {/* Subtle ground spacing grid lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <line x1="0" y1="150" x2="100%" y2="150" stroke="#FFF" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="250" y1="0" x2="250" y2="100%" stroke="#FFF" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
        </div>

        {/* Real-time SVG Cast Projection Panel */}
        <svg viewBox="0 0 500 250" className="w-[320] h-[160px] overflow-visible">
          
          {/* 1. CASTING PROJECTION SHADOWS (SVG Polygons under architectural items) */}
          <g style={{ opacity }} className="transition-opacity duration-300">
            {/* Monolith 1 Shadow Box */}
            <polygon 
              points={`150,150 180,150 ${180 + sx},${150 + sy} ${150 + sx},${150 + sy}`} 
              fill="rgba(255, 59, 48, 0.45)"
              className="transition-all duration-100"
            />
            {/* Monolith 2 Shadow Box */}
            <polygon 
              points={`230,150 270,150 ${270 + sx},${150 + sy} ${230 + sx},${150 + sy}`} 
              fill="rgba(255, 255, 255, 0.25)"
              className="transition-all duration-100"
            />
          </g>

          {/* 2. SOLID CONCRETE STATIC MONOLITHS (SVG isometric vector structures) */}
          {/* Monolith A (Left, Red Tint Profile) */}
          <g>
            {/* Front facing face */}
            <rect x="150" y="80" width="30" height="70" fill="#222222" stroke="#111" strokeWidth="0.5" />
            {/* Top angled cap */}
            <polygon points="150,80 165,70 180,80" fill="#333" stroke="#111" strokeWidth="0.5" />
          </g>

          {/* Monolith B (Middle, Tall architectural brick) */}
          <g>
            {/* Front facing face */}
            <rect x="230" y="40" width="40" height="110" fill="#181818" stroke="#111" strokeWidth="0.5" />
            {/* Right facing perspective shadow bevel */}
            <polygon points="270,40 285,50 285,150 270,150" fill="#0c0c0c" stroke="#111" strokeWidth="0.5" />
            {/* Top geometric prism cap */}
            <polygon points="230,40 245,30 285,40" fill="#2c2c2c" />
          </g>

          {/* Sizing scale measurements tags */}
          <text x="145" y="170" fill="gray" fontSize="6px" fontFamily="monospace">x={sx.toFixed(1)}px</text>
          <text x="245" y="170" fill="gray" fontSize="6px" fontFamily="monospace">y={sy.toFixed(1)}px</text>
        </svg>

        {/* Time Badge Overlay */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-[#FF3B30] flex items-center gap-1">
          <Sun className="w-3 h-3 text-[#FF3B30]" /> TIME: {timeOfDay.toFixed(1)}:00 STOCKHOLM DIURNAL VECTOR
        </div>
      </div>

      {/* Sun Azimuth Hours Slider Control */}
      <div className="w-full flex flex-col gap-1.5 border-t border-zinc-950 pt-4">
        <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest select-none">
          <span>TIME CLOCK (SOLAR ANGLE DIAL)</span>
          <span className="text-white flex items-center gap-1">
            {timeOfDay >= 12 ? "PM" : "AM"} SENSOR ANGLE: {((timeOfDay - 12) * 15).toFixed(1)}°
          </span>
        </div>
        <input 
          type="range"
          min="5.0"
          max="19.0"
          step="0.1"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(Number(e.target.value))}
          className="w-full accent-[#FF3B30] bg-zinc-950 cursor-pointer py-1.5 h-4"
        />
      </div>
    </motion.div>
  );
}
