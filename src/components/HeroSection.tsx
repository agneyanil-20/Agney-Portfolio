/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  // Capture scroll progress relative to the initial viewport fold
  const { scrollY } = useScroll();

  // Create smooth scroll interpolation mapping for the editorial parallax & blur
  const y = useTransform(scrollY, [0, 800], [0, -320]);
  const blurValue = useTransform(scrollY, [0, 800], [0, 5]);
  const filter = useTransform(blurValue, (val) => `blur(${val}px)`);

  const handleWordClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(sectionId);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 md:px-12 lg:px-24 py-12 bg-black overflow-hidden select-none">
      {/* Decorative top grid coordinates to establish the editorial graphic architecture */}
      <div className="w-full flex justify-between items-start text-[10px] md:text-xs font-mono text-zinc-500 tracking-widest uppercase">
        <div className="flex items-center gap-4">
          <span>AINO.STUDIO / PORTFOLIO</span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="hidden sm:inline">59.3293° N, 18.0686° E</span>
        </div>
        <div className="text-right">
          <span>VOLUME 01 / ED. 2026</span>
        </div>
      </div>

      {/* Main Fullscreen Sentence Statement Container */}
      <div className="flex-1 flex items-center justify-center py-20 max-w-7xl mx-auto">
         <motion.div 
          style={{ y, filter }}
          className="w-full"
        >
          <p className="font-display text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white tracking-tighter leading-[1.05] text-left md:text-justify balance">
            {/* "I" -> About section */}
            <button
              onClick={(e) => handleWordClick("about", e)}
              data-cursor="interactive"
              className="relative text-[#FF3B30] hover:text-[#ff5c54] transition-colors duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 -mx-1 cursor-pointer select-none inline"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              I
            </button>
            <span className="text-white">’ve always believed that routine is a compromise on creativity. This space brings together my </span>
            
            {/* "work" -> Projects section */}
            <button
              onClick={(e) => handleWordClick("projects", e)}
              data-cursor="interactive"
              className="relative text-[#FF3B30] hover:text-[#ff5c54] transition-colors duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 -mx-1 cursor-pointer select-none inline"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              work
            </button>
            <span className="text-white">, design process, </span>
            
            {/* "photography" -> Photography section */}
            <button
              onClick={(e) => handleWordClick("photography", e)}
              data-cursor="interactive"
              className="relative text-[#FF3B30] hover:text-[#ff5c54] transition-colors duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 -mx-1 cursor-pointer select-none inline"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              photography
            </button>
            <span className="text-white">, and ongoing </span>
            
            {/* "experiments" -> Experiments section */}
            <button
              onClick={(e) => handleWordClick("explorations", e)}
              data-cursor="interactive"
              className="relative text-[#FF3B30] hover:text-[#ff5c54] transition-colors duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 -mx-1 cursor-pointer select-none inline"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              experiments
            </button>
            
            <span className="text-white"> each shaped by curiosity, exploration, and a constant desire to create something unexpected.</span>
          </p>
        </motion.div>
      </div>

      {/* Hero Footer */}
      <div className="w-full flex justify-between items-end text-zinc-500 text-xs font-mono">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] tracking-wider text-zinc-600 uppercase">INTERACTION PROMPT</span>
          <span className="text-white tracking-widest text-[11px] animate-pulse flex items-center gap-2">
            HOVER RED WORDS OR SCROLL TO NAVIGATE <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="hidden md:flex flex-col text-right text-[10px] text-zinc-600">
          <span>© 2026 AGNEY. ALL RIGHTS RESERVED.</span>
          <span>EST. SWEDEN — GLOBAL ARCHIVE</span>
        </div>
      </div>
    </section>
  );
}
