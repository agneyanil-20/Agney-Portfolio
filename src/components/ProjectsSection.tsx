/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ArrowUpRight, ArrowLeft, ArrowRight, Sparkles, Layers } from "lucide-react";
import { Project } from "../types";

export default function ProjectsSection() {
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (ref: { current: HTMLDivElement | null }, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.5;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      ref.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const renderProjectCard = (project: Project, idx: number, isAiProduct = false) => {
    const buttonLabel = project.buttonText || (isAiProduct ? "Live Demo" : "View Case Study");

    return (
      <motion.div 
        key={project.id}
        className="flex-shrink-0 w-[85vw] md:w-[680px] snap-start group flex flex-col gap-8 bg-zinc-950/20 border border-zinc-900 p-6 md:p-8 hover:border-zinc-800 transition-colors relative"
        initial={{ opacity: 0, x: 40 }}
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
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {project.badge && (
              <span className="bg-[#FF3B30] text-black px-2.5 py-1 font-mono text-[9px] font-black tracking-widest uppercase flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                {project.badge}
              </span>
            )}
            <div className="bg-black/80 backdrop-blur-sm border border-zinc-800 px-3 py-1 font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
              REF / 0{idx + 1}
            </div>
          </div>
        </div>

        {/* Content Block */}
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              <span className="text-[#FF3B30] font-bold">{project.year}</span>
              <span className="text-zinc-800">/</span>
              <span className="truncate text-zinc-400">{project.category}</span>
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
              {project.title}
            </h3>
          </div>

          <p className="text-zinc-400 text-sm md:text-base font-light font-sans leading-relaxed tracking-wide line-clamp-3">
            {project.tagline || project.description}
          </p>

          {/* Highlights / Details */}
          {project.details && project.details.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-y border-zinc-900/60 py-4 mt-auto">
              {project.details.slice(0, 2).map((detail, dIdx) => (
                <div key={dIdx} className="flex gap-2.5 items-start">
                  <div className="w-1 h-1 rounded-full bg-[#FF3B30] mt-2 flex-shrink-0" />
                  <span className="text-zinc-400 text-[11px] font-light leading-snug">{detail}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer CTA & Tech Stack */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span 
                  key={tech} 
                  className="font-mono text-[9px] text-zinc-500 border border-zinc-900 px-2.5 py-1 bg-zinc-950/40"
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
                <span className="font-mono text-[10px] font-black tracking-widest uppercase">{buttonLabel}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <button 
                className="inline-flex items-center gap-3 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 hover:bg-white hover:text-black transition-all duration-300 group focus:outline-none cursor-pointer"
                onClick={() => alert(`Opening project details for: ${project.title}`)}
                data-cursor="interactive"
              >
                <span className="font-mono text-[10px] font-black tracking-widest uppercase">{buttonLabel}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.section 
      id="projects" 
      className="w-full bg-transparent text-white px-6 md:px-12 lg:px-24 py-12 md:py-16 overflow-hidden relative flex flex-col gap-24 md:gap-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-24 md:gap-32">
        
        {/* ====================================================
            SECTION 01: Featured Work
           ==================================================== */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4 md:gap-8">
                <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
                  Featured Work
                </h2>
                <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
                  / SECTION 01
                </div>
              </div>
              <p className="max-w-2xl font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
                A collection of real-world client projects that showcase my professional experience in UI/UX design, product design, and digital experiences.
              </p>
            </div>

            {/* Slider Controllers */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => scrollTrack(featuredScrollRef, "left")}
                className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
                title="Scroll Left"
                data-cursor="interactive"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollTrack(featuredScrollRef, "right")}
                className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
                title="Scroll Right"
                data-cursor="interactive"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div 
            ref={featuredScrollRef}
            className="flex overflow-x-auto gap-8 pb-8 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {PORTFOLIO_DATA.featuredWork.map((project, idx) => renderProjectCard(project, idx, false))}
          </div>
        </div>

        {/* ====================================================
            SECTION 02: AI Products
           ==================================================== */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4 md:gap-8">
                <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
                  AI Products
                </h2>
                <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
                  / SECTION 02
                </div>
              </div>
              <p className="max-w-2xl font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
                Personal AI-powered applications and experimental products built using modern AI development tools.
              </p>
            </div>

            {/* Slider Controllers */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => scrollTrack(aiScrollRef, "left")}
                className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
                title="Scroll Left"
                data-cursor="interactive"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollTrack(aiScrollRef, "right")}
                className="p-4 border border-zinc-900 hover:border-[#FF3B30] rounded-none bg-zinc-950 transition-all text-zinc-500 hover:text-white cursor-pointer group"
                title="Scroll Right"
                data-cursor="interactive"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div 
            ref={aiScrollRef}
            className="flex overflow-x-auto gap-8 pb-8 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {PORTFOLIO_DATA.aiProducts.map((project, idx) => renderProjectCard(project, idx, true))}
          </div>
        </div>

        {/* ====================================================
            SECTION 03: Visual Design
           ==================================================== */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4 md:gap-8">
                <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
                  Visual Design
                </h2>
                <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
                  / SECTION 03
                </div>
              </div>
              <p className="max-w-2xl font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
                A curated collection of branding, marketing campaigns, poster designs, social media creatives, and visual storytelling projects.
              </p>
            </div>

            <div className="font-mono text-[10px] text-zinc-500 border border-zinc-900 bg-zinc-950 px-4 py-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
              ARCHIVE EXPANDING SOON
            </div>
          </div>

          {/* Placeholder Grid matching Brutalist Scandinavian Aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                ref: "VISUAL_REF / 01",
                title: "Brand Identities & Campaign Systems",
                description: "Cohesive corporate identities, typography systems, and multi-channel marketing campaigns.",
                tags: ["Branding", "Typography", "Visual Identity"]
              },
              {
                ref: "VISUAL_REF / 02",
                title: "Poster Architecture & Editorial Art",
                description: "Experimental poster compositions, layout graphics, and print artwork exploring visual rhythm.",
                tags: ["Poster Design", "Editorial", "Print Art"]
              },
              {
                ref: "VISUAL_REF / 03",
                title: "Social Creatives & Motion Storytelling",
                description: "High-impact social media creatives, motion graphics, and digital storytelling assets.",
                tags: ["Social Creatives", "Motion", "Campaigns"]
              }
            ].map((item, idx) => (
              <motion.div
                key={item.ref}
                className="group border border-dashed border-zinc-900 bg-zinc-950/20 p-8 flex flex-col justify-between min-h-[320px] hover:border-zinc-800 transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{item.ref}</span>
                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest border border-zinc-900 px-2 py-0.5">
                      COMING SOON
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white leading-tight group-hover:text-[#FF3B30] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-xs md:text-sm font-light font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-zinc-900/60 mt-8">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[8px] text-zinc-600 border border-zinc-900 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    <Layers className="w-3 h-3" />
                    <span>IN CURATION</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
}

