/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";

export default function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();

  // Ordered projects strictly matching prompt specification:
  // 01 Luxe Moto, 02 Speeki AI, 03 Cntrl M, 04 Sound Sketchbook, 05 Photobooth, 06 Neeli
  const projectsList: Project[] = React.useMemo(() => {
    const rawList = PORTFOLIO_DATA.projects || [];
    const desiredOrder = ["luxe-moto", "speeki-ai", "cntrl-m", "sound-sketchbook", "photobooth", "neeli"];
    
    const ordered: Project[] = [];
    desiredOrder.forEach((id) => {
      const found = rawList.find((p) => p.id === id);
      if (found) ordered.push(found);
    });

    rawList.forEach((p) => {
      if (!ordered.some((o) => o.id === p.id)) {
        ordered.push(p);
      }
    });

    return ordered;
  }, []);

  const [activeProjectId, setActiveProjectId] = useState<string>(() => projectsList[0]?.id || "luxe-moto");

  const activeProject = React.useMemo(() => {
    return projectsList.find((p) => p.id === activeProjectId) || projectsList[0];
  }, [projectsList, activeProjectId]);

  return (
    <section 
      id="projects" 
      className="w-full bg-transparent text-white px-6 md:px-12 lg:px-16 py-20 md:py-28 overflow-hidden relative"
    >
      <div className="max-w-[1150px] mx-auto w-full flex flex-col">
        
        {/* Section Header: Minimalist Editorial Title */}
        <div className="flex items-baseline gap-3 md:gap-4 mb-10 md:mb-14">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
            Works
          </h2>
          <span className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest">
            (SELECTED WORKS)
          </span>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Numbered Project List (approx 38% width) - Clean typography without lines */}
          <div className="lg:col-span-5 flex flex-col">
            {projectsList.map((project, idx) => {
              const isActive = project.id === activeProject?.id;
              const formattedNum = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProjectId(project.id)}
                  onMouseEnter={() => setActiveProjectId(project.id)}
                  className="group relative flex items-center justify-between py-3 md:py-3.5 cursor-pointer transition-colors duration-200 select-none"
                  data-cursor="interactive"
                >
                  {/* Subtle Vertical Active Indicator on Far Left */}
                  <div 
                    className={`absolute -left-3 md:-left-4 top-2 bottom-2 w-[2.5px] rounded-full transition-all duration-300 ${
                      isActive 
                        ? "bg-white opacity-100 scale-y-100" 
                        : "bg-zinc-600 opacity-0 scale-y-50 group-hover:opacity-40 group-hover:scale-y-75"
                    }`}
                  />

                  {/* Number + Title */}
                  <div className="flex items-baseline gap-3 md:gap-4">
                    <span className={`font-mono text-xs md:text-sm tracking-tight transition-colors duration-200 ${
                      isActive ? "text-zinc-400 font-medium" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}>
                      ({formattedNum})
                    </span>

                    {project.projectUrl ? (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveProjectId(project.id)}
                        className={`font-sans text-xl md:text-2xl tracking-tight transition-colors duration-200 no-underline outline-none focus:outline-none ${
                          isActive 
                            ? "text-white font-semibold" 
                            : "text-zinc-500 font-normal hover:text-white group-hover:text-zinc-300"
                        }`}
                        data-cursor="interactive"
                      >
                        {project.title}
                      </a>
                    ) : (
                      <span className={`font-sans text-xl md:text-2xl tracking-tight transition-colors duration-200 ${
                        isActive 
                          ? "text-white font-semibold" 
                          : "text-zinc-500 font-normal group-hover:text-zinc-300"
                      }`}>
                        {project.title}
                      </span>
                    )}
                  </div>

                  {/* Subtle year metadata on hover/active */}
                  <div className="pl-2">
                    <span className={`font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                      isActive ? "text-zinc-400 opacity-100" : "text-zinc-600 opacity-0 group-hover:opacity-70"
                    }`}>
                      {project.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Large Project Preview (approx 62% width) */}
          <div className="lg:col-span-7 flex flex-col">
            {activeProject && (
              <div className="flex flex-col gap-5 w-full">
                
                {/* Stable Image Preview Container with Seamless Overlapping Blur-in / Blur-out Layers */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800/60 shadow-lg">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={activeProject.id}
                      className="absolute inset-0 w-full h-full origin-center will-change-[filter,opacity,transform]"
                      initial={
                        shouldReduceMotion 
                          ? { opacity: 0 } 
                          : { filter: "blur(12px)", opacity: 0, scale: 0.98 }
                      }
                      animate={
                        shouldReduceMotion 
                          ? { opacity: 1 } 
                          : { filter: "blur(0px)", opacity: 1, scale: 1 }
                      }
                      exit={
                        shouldReduceMotion 
                          ? { opacity: 0 } 
                          : { filter: "blur(12px)", opacity: 0, scale: 0.98 }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0.15 : 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <img
                        src={activeProject.imageUrl}
                        alt={activeProject.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Restrained Project Information with Smooth Content Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col gap-2.5 pt-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-800/40 pb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
                          {activeProject.title}
                        </h3>
                        {activeProject.projectUrl && (
                          <a
                            href={activeProject.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${activeProject.title} website`}
                            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-300 group/arrow focus:outline-none p-0.5"
                            data-cursor="interactive"
                          >
                            <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover/arrow:text-white transition-all duration-300 ease-out group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
                          </a>
                        )}
                      </div>
                      <div className="font-mono text-xs text-zinc-500 tracking-wider">
                        <span>{activeProject.category}</span>
                        <span className="mx-2 text-zinc-700">/</span>
                        <span>{activeProject.year}</span>
                      </div>
                    </div>

                    <p className="text-zinc-400 font-sans text-xs md:text-sm font-light leading-relaxed max-w-xl">
                      {activeProject.description || activeProject.tagline}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
