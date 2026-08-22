/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { CareerPosition } from "../types";

export default function CareerSection() {
  const shouldReduceMotion = useReducedMotion();
  const careerList: CareerPosition[] = PORTFOLIO_DATA.careerPathway || [];

  const [activePositionId, setActivePositionId] = useState<string>(() => careerList[0]?.id || "creative-lead");

  const activePosition = React.useMemo(() => {
    return careerList.find((p) => p.id === activePositionId) || careerList[0];
  }, [careerList, activePositionId]);

  return (
    <section 
      id="career" 
      className="w-full bg-transparent text-white px-5 sm:px-6 md:px-12 lg:px-16 py-14 sm:py-16 md:py-28 overflow-hidden relative"
    >
      <div className="max-w-[1150px] mx-auto w-full flex flex-col">
        
        {/* Section Header: Minimalist Editorial Title (Mobile responsive) */}
        <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-4 mb-7 sm:mb-9 md:mb-14">
          <h2 className="font-display text-[34px] xs:text-[40px] sm:text-[48px] md:text-6xl font-bold tracking-tight text-white leading-none">
            Career Pathway
          </h2>
          <span className="font-mono text-[11px] sm:text-xs md:text-sm text-zinc-500 uppercase tracking-widest shrink-0">
            (CAREER PATHWAY)
          </span>
        </div>

        {/* Layout: Single column on mobile (<768px), Two-column on desktop (>=768px) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-start">
          
          {/* Career Positions List: Order 1 on mobile, Left Column on desktop */}
          <div className="md:col-span-5 flex flex-col gap-1 sm:gap-1.5 md:gap-0">
            {careerList.map((pos) => {
              const isActive = pos.id === activePosition?.id;

              return (
                <div
                  key={pos.id}
                  onClick={() => setActivePositionId(pos.id)}
                  onMouseEnter={() => setActivePositionId(pos.id)}
                  className="group relative flex items-start sm:items-baseline justify-between py-2 sm:py-2.5 md:py-3.5 cursor-pointer transition-colors duration-200 select-none"
                  data-cursor="interactive"
                >
                  {/* Subtle Vertical Active Indicator on Far Left */}
                  <div 
                    className={`absolute -left-2.5 sm:-left-3 md:-left-4 top-1.5 bottom-1.5 w-[2px] md:w-[2.5px] rounded-full transition-all duration-300 ${
                      isActive 
                        ? "bg-white opacity-100 scale-y-100" 
                        : "bg-zinc-600 opacity-0 scale-y-50 group-hover:opacity-40 group-hover:scale-y-75"
                    }`}
                  />

                  {/* Number + Position Title */}
                  <div className="flex items-start sm:items-baseline gap-2.5 sm:gap-3 md:gap-4">
                    <span className={`font-mono text-xs md:text-sm tracking-tight transition-colors duration-200 shrink-0 pt-0.5 sm:pt-0 ${
                      isActive ? "text-zinc-400 font-medium" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}>
                      ({pos.number})
                    </span>

                    <span className={`font-sans text-lg sm:text-xl md:text-2xl tracking-tight transition-colors duration-200 leading-tight sm:leading-snug md:leading-normal ${
                      isActive 
                        ? "text-white font-semibold" 
                        : "text-zinc-500 font-normal group-hover:text-zinc-300"
                    }`}>
                      {pos.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Story & Responsibilities: Order 2 on mobile, Right Column on desktop */}
          <div className="md:col-span-7 flex flex-col md:min-h-[340px] pt-5 md:pt-0 border-t border-zinc-800/50 md:border-t-0">
            <AnimatePresence mode="wait">
              {activePosition && (
                <motion.div
                  key={activePosition.id}
                  initial={
                    shouldReduceMotion 
                      ? { opacity: 0 } 
                      : { filter: "blur(10px)", opacity: 0, y: 8 }
                  }
                  animate={
                    shouldReduceMotion 
                      ? { opacity: 1 } 
                      : { filter: "blur(0px)", opacity: 1, y: 0 }
                  }
                  exit={
                    shouldReduceMotion 
                      ? { opacity: 0 } 
                      : { filter: "blur(10px)", opacity: 0, y: -8 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.15 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col w-full will-change-[filter,opacity,transform]"
                >
                  {/* Position Title & Metadata Header */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 border-b border-zinc-800/40 pb-3.5 sm:pb-4 mb-4 sm:mb-6">
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase leading-tight">
                      {activePosition.title}
                    </h3>
                    
                    <div className="font-mono text-xs sm:text-sm text-zinc-400 tracking-wider flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-zinc-300 font-medium">{activePosition.company}</span>
                      <span className="text-zinc-700">/</span>
                      <span className="text-zinc-500">{activePosition.period}</span>
                    </div>
                  </div>

                  {/* Clean Editorial Description Paragraphs */}
                  <div className="flex flex-col space-y-3 sm:space-y-4 max-w-2xl">
                    {activePosition.description.map((paragraph, pIdx) => (
                      <p 
                        key={pIdx}
                        className="text-zinc-400 font-sans text-sm sm:text-[15px] md:text-base font-light leading-[1.6] sm:leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
