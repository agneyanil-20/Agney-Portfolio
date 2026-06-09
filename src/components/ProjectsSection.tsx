/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section 
      id="projects" 
      className="w-full bg-black text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
              Work
            </h2>
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
              / PORTFOLIO
            </div>
          </div>
          <p className="max-w-md font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed tracking-wide text-left">
            A curation of products, audio experiments, and digital storytelling platforms built with intent and a focus on polished interactions.
          </p>
        </div>

        {/* Content: List of Projects */}
        <div className="flex flex-col gap-32 md:gap-40">
          {PORTFOLIO_DATA.projects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={project.id}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 items-center"
              >
                {/* Image Column */}
                <div className={`lg:col-span-6 xl:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded bg-zinc-950 group cursor-pointer"
                  >
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter scale-100 grayscale contrast-[1.1] brightness-[0.8] transition-all duration-750 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:contrast-[1.02] group-hover:brightness-[0.95]" 
                    />
                  </motion.div>
                </div>

                {/* Details Column */}
                <div className={`lg:col-span-6 xl:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col gap-6"
                  >
                    {/* Index, Year, Category */}
                    <div className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] text-zinc-500 uppercase tracking-widest">
                      <span>0{idx + 1}</span>
                      <span className="text-zinc-800">/</span>
                      <span>{project.year}</span>
                      <span className="text-zinc-800">/</span>
                      <span className="text-[#FF3B30] truncate">{project.category}</span>
                    </div>

                    {/* Title & Tagline */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
                        {project.title}
                      </h3>
                      <p className="text-zinc-300 text-base md:text-lg font-normal leading-relaxed tracking-wide">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-col gap-3 pt-2">
                      <span className="font-mono text-[9px] text-zinc-550 tracking-widest uppercase">// CORE HIGHLIGHTS</span>
                      <ul className="flex flex-col gap-2">
                        {project.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5">
                            <span className="text-[#FF3B30] text-sm leading-none select-none">•</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech List */}
                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      <span className="font-mono text-[9px] text-zinc-550 tracking-widest uppercase mr-1">TECH:</span>
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="font-mono text-[10px] text-zinc-500 bg-zinc-950/50 px-2 py-0.5 rounded border border-zinc-900/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA link */}
                    <div className="pt-4">
                      {project.projectUrl ? (
                        <a 
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs text-white hover:text-[#FF3B30] transition-colors border border-zinc-800 hover:border-[#FF3B30] rounded px-5 py-2.5 bg-zinc-950 hover:bg-black group select-none cursor-pointer"
                        >
                          VIEW PROJECT <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <button 
                          className="inline-flex items-center gap-2 font-mono text-xs text-white hover:text-[#FF3B30] transition-colors border border-zinc-800 hover:border-[#FF3B30] rounded px-5 py-2.5 bg-zinc-950 hover:bg-black group select-none cursor-pointer"
                          onClick={() => alert(`Launching live interface module for: ${project.title}`)}
                        >
                          LAUNCH MODULE <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
