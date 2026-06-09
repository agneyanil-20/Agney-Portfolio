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
      {/* Non-rendering header placeholder for spacing balance */}
      <div className="w-full h-4" />

      {/* Main Fullscreen Sentence Statement Container */}
      <div className="flex-1 flex items-center justify-center py-20 max-w-7xl mx-auto">
         <motion.div 
          style={{ y, filter }}
          className="w-full"
        >
          <p className="font-display text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white tracking-tighter leading-[1.05] text-left md:text-justify balance">
            {/* "I" -> About section */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleWordClick("about", e)}
              data-cursor="interactive"
              className="inline-block relative text-[#FF3B30] hover:text-[#ff5c54] transition-all duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 cursor-pointer select-none origin-center group"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              I
              <span className="absolute bottom-[2px] left-1 right-1 h-[2px] md:h-[3px] bg-[#FF3B30] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>
            <span className="text-white">’ve always believed that routine is a compromise on creativity. This space brings together my </span>
            
            {/* "work" -> Projects section */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleWordClick("projects", e)}
              data-cursor="interactive"
              className="inline-block relative text-[#FF3B30] hover:text-[#ff5c54] transition-all duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 cursor-pointer select-none origin-center group"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              work
              <span className="absolute bottom-[2px] left-1 right-1 h-[2px] md:h-[3px] bg-[#FF3B30] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>
            <span className="text-white">, design process, </span>
            
            {/* "photography" -> Photography section */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleWordClick("photography", e)}
              data-cursor="interactive"
              className="inline-block relative text-[#FF3B30] hover:text-[#ff5c54] transition-all duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 cursor-pointer select-none origin-center group"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              photography
              <span className="absolute bottom-[2px] left-1 right-1 h-[2px] md:h-[3px] bg-[#FF3B30] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>
            <span className="text-white">, and ongoing </span>
            
            {/* "experiments" -> Experiments section */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleWordClick("explorations", e)}
              data-cursor="interactive"
              className="inline-block relative text-[#FF3B30] hover:text-[#ff5c54] transition-all duration-300 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#FF3B30] rounded px-1 cursor-pointer select-none origin-center group"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              experiments
              <span className="absolute bottom-[2px] left-1 right-1 h-[2px] md:h-[3px] bg-[#FF3B30] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>
            
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
