/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ArrowUpRight, ArrowLeft, ArrowRight, Sparkles, Globe, X, FileText } from "lucide-react";
import { Project } from "../types";

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="flex flex-col gap-2 my-3 pl-1">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0 mt-1.5" />
              <span className="text-zinc-900 font-medium text-xs md:text-sm leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      currentList.push(trimmed.slice(2));
      return;
    }

    flushList(`list-${idx}`);

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={idx} className="font-display text-xl md:text-2xl font-black text-black uppercase tracking-tight my-4">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={idx} className="font-mono text-sm md:text-base font-bold text-[#FF3B30] uppercase tracking-wider mt-6 mb-2">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="font-sans text-xs md:text-sm font-bold text-zinc-900 mt-4 mb-1">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed === "---") {
      // Clean spacing without unwanted divider lines
      elements.push(<div key={idx} className="h-3" />);
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={idx} className="text-zinc-800 font-normal text-xs md:text-sm leading-relaxed my-2 font-sans">
          {trimmed}
        </p>
      );
    }
  });

  flushList(`list-final`);

  return <div className="space-y-1">{elements}</div>;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const hasFullWriteup = Boolean(project.fullWriteup);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* White Glassmorphic Modal Container */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-6 md:p-8 text-black flex flex-col gap-6 rounded-2xl md:rounded-3xl font-sans"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200/80">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-[#FF3B30]">
              <span>{project.category}</span>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-500 font-mono">{project.year}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-black tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-[#FF3B30] text-zinc-700 hover:text-white border border-zinc-200/80 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all duration-300 cursor-pointer"
            data-cursor="interactive"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Modal Main Content */}
        {hasFullWriteup && project.fullWriteup ? (
          <div className="prose prose-zinc max-w-none text-zinc-800">
            <MarkdownContent content={project.fullWriteup} />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-zinc-800 font-normal text-xs md:text-sm leading-relaxed">
              {project.description || project.tagline}
            </p>

            {project.details && project.details.length > 0 && (
              <div className="flex flex-col gap-2.5 bg-zinc-50/80 border border-zinc-200/70 p-5 rounded-xl">
                <span className="font-mono text-[11px] text-[#FF3B30] uppercase font-bold tracking-widest">Key Highlights</span>
                <ul className="flex flex-col gap-2">
                  {project.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs md:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0 mt-1.5" />
                      <span className="text-zinc-900 font-medium text-xs md:text-sm leading-relaxed">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Technologies & Tools</span>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="font-mono text-[10px] md:text-xs text-zinc-800 border border-zinc-200/80 px-2.5 py-1 rounded-lg bg-zinc-100/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer CTA */}
        <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between gap-4 mt-2">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FF3B30] hover:bg-black text-white font-mono text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all duration-300"
              data-cursor="interactive"
            >
              <span>See Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-mono text-[11px] font-bold uppercase px-4 py-2.5 rounded-xl border border-zinc-200/80 transition-all cursor-pointer ml-auto"
            data-cursor="interactive"
          >
            Close Window
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCardImage({ project, refTag }: { project: Project; refTag: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
      {/* Skeleton Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-zinc-950 flex flex-col items-center justify-center p-4 border border-zinc-900/80">
          <div className="w-full h-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 bg-[length:200%_100%] animate-pulse flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
              <span>FETCHING_ASSET</span>
            </div>
            <div className="w-20 h-0.5 bg-zinc-800/80 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#FF3B30]/60 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Fallback Error State */}
      {hasError && (
        <div className="absolute inset-0 z-10 bg-zinc-950 flex items-center justify-center p-4 border border-zinc-900">
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">[ ASSET_UNAVAILABLE ]</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={project.imageUrl}
        alt={project.title}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />

      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {project.badge && project.badge.toUpperCase() !== "AI PRODUCT" && (
          <span className="bg-[#FF3B30] text-black px-2 py-0.5 font-mono text-[8px] font-black tracking-widest uppercase flex items-center gap-1 shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            {project.badge}
          </span>
        )}
        <div className="bg-black/80 backdrop-blur-sm border border-zinc-800 px-2.5 py-1 font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
          {refTag}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    const buttonLabel = project.buttonText === "Live Demo" || isAiProduct || project.buttonText === "See Website"
      ? "See Website" 
      : (project.buttonText || "View Case Study");
    const refTag = `REF / 0${idx + 1}`;

    return (
      <motion.div 
        key={project.id}
        className="flex-shrink-0 w-[85vw] sm:w-[340px] md:w-[380px] snap-start group border border-zinc-900 bg-zinc-950/40 hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between overflow-hidden relative"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: idx * 0.08 }}
      >
        {/* Cover Image Container with Skeleton */}
        <ProjectCardImage project={project} refTag={refTag} />

        {/* Card Content */}
        <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
          <div className="flex flex-col gap-2">
            {/* Category & Year */}
            <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest">
              <span className="text-[#FF3B30]">{project.category}</span>
              <span className="text-zinc-500 font-mono text-[10px]">{project.year}</span>
            </div>

            {/* Project Title */}
            <h3 className="font-display text-xl md:text-2xl font-black tracking-tight text-white leading-tight group-hover:text-[#FF3B30] transition-colors">
              {project.title}
            </h3>

            {/* Description / Tagline */}
            <p className="text-zinc-400 text-xs font-light font-sans leading-relaxed line-clamp-2">
              {project.tagline || project.description}
            </p>

            {/* Technologies tags */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="font-mono text-[8px] text-zinc-400 border border-zinc-900 px-2 py-0.5 bg-zinc-950/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-zinc-900/80 mt-2 flex items-center justify-between gap-2">
            {project.projectUrl ? (
              <a 
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-[#FF3B30] text-white hover:text-black font-mono text-[10px] font-black tracking-widest uppercase px-3.5 py-2.5 transition-all duration-300 focus:outline-none group/btn shrink-0"
                data-cursor="interactive"
              >
                <span>{buttonLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <button 
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-[#FF3B30] text-white hover:text-black font-mono text-[10px] font-black tracking-widest uppercase px-3.5 py-2.5 transition-all duration-300 focus:outline-none group/btn cursor-pointer shrink-0"
                onClick={() => setSelectedProject(project)}
                data-cursor="interactive"
              >
                <span>{buttonLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            )}

            <button
              onClick={() => setSelectedProject(project)}
              className="inline-flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-[10px] font-bold tracking-widest uppercase px-3.5 py-2.5 transition-all duration-300 cursor-pointer shrink-0"
              data-cursor="interactive"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span>See More</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
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
                CURATED SHOWCASE
              </div>
            </div>

            {/* Single Featured Box redirecting to Behance */}
            <motion.a
              href="https://www.behance.net/agneyanil"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-zinc-900 bg-zinc-950/40 hover:border-[#FF3B30] p-8 md:p-12 transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              data-cursor="interactive"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col gap-4 max-w-2xl">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-[#FF3B30] uppercase font-bold tracking-widest">
                    <Globe className="w-4 h-4" />
                    <span>BEHANCE PORTFOLIO ARCHIVE</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-none group-hover:text-[#FF3B30] transition-colors">
                    Explore Full Visual Design Collection
                  </h3>
                  <p className="text-zinc-400 text-sm font-light font-sans leading-relaxed">
                    Branding, typography systems, marketing campaigns, poster art, and visual storytelling curated on Behance.
                  </p>
                </div>

                <div className="flex-shrink-0 inline-flex items-center gap-3 bg-[#FF3B30] group-hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase px-8 py-4 transition-all duration-300 shadow-xl shadow-[#FF3B30]/10">
                  <span>View on Behance</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-black" />
                </div>
              </div>
            </motion.a>
          </div>

        </div>
      </motion.section>

      {/* Glassmorphic Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}


