/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { Project } from "../types";
import { Plus, Minus, ArrowUpRight, HelpCircle } from "lucide-react";

export default function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <section 
      id="projects" 
      className="min-h-screen w-full bg-black text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-6 animate-fadeIn">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white animate-pulse">
              Work
            </h2>
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
              / SELECTED PORTFOLIO INDEX
            </div>
          </div>
          <p className="max-w-md font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide text-left md:text-right">
            A collection of products, experiments, and ideas built through curiosity, iteration, and a desire to explore what's possible.
          </p>
        </div>

        {/* Layout: Main content splits into a Left/Right layout on large desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Main List of Interactive Rows) */}
          <div className="xl:col-span-8 flex flex-col">
            <div className="hidden md:grid grid-cols-12 pb-3 border-b border-zinc-900 font-mono text-[10px] text-zinc-500 tracking-wider uppercase px-4">
              <div className="col-span-1">/ ID</div>
              <div className="col-span-5">PROJECT PROJECT NAME</div>
              <div className="col-span-4">CATEGORY CODE</div>
              <div className="col-span-2 text-right">YEAR</div>
            </div>

            <div className="flex flex-col">
              {PORTFOLIO_DATA.projects.map((project, idx) => {
                const isExpanded = expandedId === project.id;
                return (
                  <div 
                    key={project.id}
                    className="border-b border-zinc-900"
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    {/* Row Trigger */}
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="w-full flex flex-col md:grid md:grid-cols-12 py-6 md:py-8 text-left hover:bg-zinc-950 transition-colors duration-200 px-4 items-center justify-between gap-4 select-none focus:outline-none focus:ring-1 focus:ring-zinc-850"
                    >
                      <div className="hidden md:block col-span-1 font-mono text-xs text-zinc-600">
                        0{idx + 1}.
                      </div>
                      <div className="w-full md:col-span-5 font-display text-lg md:text-2xl font-bold tracking-tight text-white flex items-center justify-between md:justify-start gap-4">
                        <span>{project.title}</span>
                        {/* Mobile Only: Badge */}
                        <span className="md:hidden font-mono text-[10px] bg-zinc-900 px-2.5 py-0.5 text-zinc-400">
                          {project.year}
                        </span>
                      </div>
                      <div className="w-full md:col-span-4 font-mono text-xs text-zinc-400 md:text-zinc-500">
                        {project.category}
                      </div>
                      <div className="col-span-2 hidden md:block text-right font-mono text-zinc-300">
                        {project.year}
                      </div>
                      
                      {/* Expansion Plus/Minus Icon */}
                      <div className="absolute right-4 md:static flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[#FF3B30] border border-zinc-800"
                        >
                          {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </motion.div>
                      </div>
                    </button>

                    {/* Expandable Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden bg-[#050505] border-t border-zinc-950"
                        >
                          <div className="p-6 md:p-8 flex flex-col gap-8">
                            {/* Project Description & Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="flex flex-col gap-4">
                                <span className="font-mono text-[#FF3B30] text-[10px] tracking-widest uppercase">// CONCEPT OVERVIEW</span>
                                <h4 className="text-white text-lg font-display font-medium leading-relaxed">
                                  {project.tagline}
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                  {project.description}
                                </p>
                              </div>

                              <div className="flex flex-col gap-4">
                                <span className="font-mono text-zinc-500 text-[10px] tracking-widest uppercase">// PERFORMANCE MATRIX</span>
                                <ul className="flex flex-col gap-2 font-mono text-xs">
                                  {project.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2.5 text-zinc-300 border-b border-zinc-900 pb-2">
                                      <span className="text-[#FF3B30]">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Project Meta: Tech Tags & Call to Action */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-zinc-900">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="font-mono text-zinc-500 text-[10px] mr-2 uppercase tracking-tight">ENGINE:</span>
                                {project.technologies.map((tech) => (
                                  <span key={tech} className="bg-zinc-950 font-mono text-[10px] px-2.5 py-1 text-zinc-500 rounded border border-zinc-900">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              
                              {project.projectUrl ? (
                                <a 
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 font-mono text-xs text-white hover:text-[#FF3B30] transition-colors border border-zinc-800 hover:border-[#FF3B30] rounded px-4 py-2 bg-zinc-950 group select-none cursor-pointer"
                                >
                                  VIEW PROJECT <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                              ) : (
                                <button 
                                  className="flex items-center gap-2 font-mono text-xs text-white hover:text-[#FF3B30] transition-colors border border-zinc-800 hover:border-[#FF3B30] rounded px-4 py-2 bg-zinc-950 group select-none cursor-pointer"
                                  onClick={() => alert(`Launching live interface module for: ${project.title}`)}
                                >
                                  LAUNCH MODULE <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                              )}
                            </div>

                            {/* Large expanded visual only for smaller screen sizes where preview columns are hidden */}
                            <div className="md:hidden w-full aspect-[16/10] overflow-hidden rounded border border-zinc-900 mt-4">
                              <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover grayscale contrast-125" 
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: High-contrast responsive Visual Preview Area (sticky on desk) */}
          <div className="xl:col-span-4 hidden xl:block sticky top-36">
            <div className="relative aspect-[4/5] w-full bg-zinc-950 border border-zinc-900 overflow-hidden flex flex-col justify-between p-6">
              
              {/* Dynamic Image Overlay */}
              <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                  {hoveredProject ? (
                    <motion.img
                      key={hoveredProject.id}
                      src={hoveredProject.imageUrl}
                      alt={hoveredProject.title}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 0.6, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover grayscale contrast-125 brightness-75"
                    />
                  ) : (
                    <motion.div 
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full bg-black/40 flex items-center justify-center p-8 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-[1px] bg-zinc-800" />
                        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                          HOVER ROW TO STREAM COVER SHADOWS
                        </span>
                        <div className="w-12 h-[1px] bg-zinc-800" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative top grid labels */}
              <div className="relative z-10 flex justify-between items-start font-mono text-[9px] text-zinc-400">
                <span>VIEWPORT CAPTURE: 01</span>
                <span>SYSTEM RENDERER</span>
              </div>

              {/* Grid content footer */}
              <div className="relative z-10 flex flex-col gap-2 mt-auto">
                <AnimatePresence mode="wait">
                  {hoveredProject ? (
                    <motion.div
                      key={hoveredProject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col"
                    >
                      <span className="font-mono text-[10px] text-[#FF3B30]">ACTIVES SELECTED:</span>
                      <span className="font-display text-2xl font-black text-white">{hoveredProject.title}</span>
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mt-1">
                        {hoveredProject.category} // {hoveredProject.year}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col opacity-35">
                      <span className="font-mono text-[10px] text-zinc-500 font-bold">MONITOR IDLE</span>
                      <span className="font-display text-xl font-bold text-zinc-400">Archival Indexes</span>
                      <span className="font-mono text-[10px] text-zinc-500">System idle...</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
