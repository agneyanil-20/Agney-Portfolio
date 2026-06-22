/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

export default function ProjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.5;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section 
      id="projects" 
      className="w-full bg-black text-white px-6 md:px-12 lg:px-24 py-16 md:py-24 overflow-hidden relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-4 md:gap-8">
              <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
                Work
              </h2>
              <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
                / SELECTED PROJECTS
              </div>
            </div>
            <p className="max-w-xl font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
              A curation of digital experiences, products, and AI prototypes built with intent and technical precision.
            </p>
          </div>

          {/* Slider Controllers */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scroll("left")}
              className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
              title="Scroll Left"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
              title="Scroll Right"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-12 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {PORTFOLIO_DATA.projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              className="flex-shrink-0 w-[85vw] md:w-[700px] snap-start group flex flex-col gap-8 bg-zinc-950/20 border border-zinc-900 p-6 md:p-8 hover:border-zinc-800 transition-colors"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.7] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-90 group-hover:contrast-100"
                  draggable={false}
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-zinc-800 px-3 py-1 font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
                  PROJECT_REF / 0{idx + 1}
                </div>
              </div>

              {/* Content Block */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    <span className="text-[#FF3B30] font-bold">{project.year}</span>
                    <span className="text-zinc-800">/</span>
                    <span className="truncate">{project.category}</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
                    {project.title}
                  </h3>
                </div>

                <p className="text-zinc-400 text-sm md:text-base font-light font-sans leading-relaxed tracking-wide line-clamp-3">
                  {project.tagline} {project.description}
                </p>

                {/* Highlights Summary */}
                <div className="grid grid-cols-2 gap-4 border-y border-zinc-900/50 py-6">
                  {project.details.slice(0, 2).map((detail, dIdx) => (
                    <div key={dIdx} className="flex gap-3 items-start">
                      <div className="w-1 h-1 rounded-full bg-[#FF3B30] mt-2 flex-shrink-0" />
                      <span className="text-zinc-500 text-[11px] font-light leading-snug">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[9px] text-zinc-600 border border-zinc-900 px-2 py-0.5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.projectUrl ? (
                    <a 
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#FF3B30] text-black px-6 py-3 hover:bg-white transition-all duration-300 group focus:outline-none"
                      data-cursor="interactive"
                    >
                      <span className="font-mono text-[10px] font-black tracking-widest uppercase">Launch Project</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button 
                      className="inline-flex items-center gap-3 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 hover:bg-white hover:text-black transition-all duration-300 group focus:outline-none cursor-pointer"
                      onClick={() => alert(`Launching live interface module for: ${project.title}`)}
                      data-cursor="interactive"
                    >
                      <span className="font-mono text-[10px] font-black tracking-widest uppercase">Internal Module</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Statistics / Callout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-900 pt-16">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Total Projects</span>
            <span className="font-display text-4xl font-black text-white">{PORTFOLIO_DATA.projects.length}+</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Total Sprints</span>
            <span className="font-display text-4xl font-black text-white">200+</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-[#FF3B30] uppercase tracking-widest font-black">AI Prototypes</span>
            <span className="font-display text-4xl font-black text-white">12+</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Client Satisfaction</span>
            <span className="font-display text-4xl font-black text-white">100%</span>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
