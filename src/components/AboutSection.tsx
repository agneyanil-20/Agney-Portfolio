/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MapPin, Instagram, MessageSquare, BookOpen, ExternalLink, Globe } from "lucide-react";

export default function AboutSection() {
  const { name, role, subRole, location, coordinates, bioShort, bioLong, philosophy, skills, timeline, highlights, socials } = PORTFOLIO_DATA.about;

  // Calculate estimated reading time based on 200 WPM
  const editorialText = [
    bioShort,
    ...bioLong,
    ...philosophy.flatMap(p => [p.title, p.description]),
    ...(highlights || [])
  ].join(" ");
  const wordCount = editorialText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <section 
      id="about" 
      className="min-h-screen w-full bg-black text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-4">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
              I
            </h2>
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed text-balance">
              / THE PROFILE & PHILOSOPHY
            </div>
          </div>
          <div className="text-right font-mono text-zinc-400 text-xs md:text-sm flex flex-col md:items-end gap-1">
            <span className="flex items-center gap-1 justify-end"><MapPin className="w-3.5 h-3.5 text-[#FF3B30]" /> {location}</span>
            <span className="text-zinc-600 font-light italic">{coordinates}</span>
            <span className="text-zinc-500 text-[10px] tracking-wider uppercase flex items-center gap-1.5 mt-1 justify-end">
              <BookOpen className="w-3.5 h-3.5 text-[#FF3B30]" /> EST. READING TIME // {readingTime} MIN
            </span>
          </div>
        </div>

        {/* Swiss Two-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Editorial Monochromatic Photo Grid */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <motion.div 
                className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden border border-zinc-800 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://res.cloudinary.com/demmybfne/image/upload/v1780927458/ChatGPT_Image_Jun_8_2026_07_29_29_PM_nsm03y.png"
                  alt="Agney Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:contrast-115 group-hover:brightness-100"
                />
                {/* Corner brackets simulating editorial viewfinder grids */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/40" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/40" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/40" />
                
                <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-wider">
                  PORTRAIT 01 // Grayscale contrast mapping
                </div>
              </motion.div>

              {/* Personal Intro under Image */}
              {bioShort && (
                <motion.div 
                  className="p-6 bg-zinc-950/50 border border-zinc-900 border-l-2 border-l-[#FF3B30]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-zinc-400 text-sm md:text-base font-light italic leading-relaxed">
                    "{bioShort}"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6 border-t border-zinc-800 pt-8 font-mono text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">NAME</span>
                  <span className="text-white text-sm font-medium">{name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">ROLE</span>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">{role}</span>
                    {subRole && (
                      <span className="text-[#FF3B30] text-[9px] font-bold italic tracking-tighter uppercase">
                        {subRole}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">SOCIAL</span>
                  <a 
                    href={socials.instagram}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-[#FF3B30] text-black px-4 py-3 hover:bg-white transition-all duration-300 group focus:outline-none"
                    data-cursor="interactive"
                  >
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4" />
                      <span className="text-[10px] tracking-[0.1em] uppercase font-black">Instagram</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">PORTFOLIO</span>
                  <a 
                    href={socials.behance}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-[#FF3B30] text-black px-4 py-3 hover:bg-white transition-all duration-300 group focus:outline-none"
                    data-cursor="interactive"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] tracking-[0.1em] uppercase font-black">Behance</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">DIRECT</span>
                  <a 
                    href={socials.whatsapp}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-[#FF3B30] text-black px-4 py-3 hover:bg-white transition-all duration-300 group focus:outline-none"
                    data-cursor="interactive"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] tracking-[0.1em] uppercase font-black">WhatsApp</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>

              {/* Achievements / Highlights Section */}
              {highlights && (
                <div className="flex flex-col gap-4 pt-4 border-t border-zinc-900">
                  <h3 className="font-mono text-zinc-500 text-[10px] tracking-widest uppercase">
                    // SELECTED HIGHLIGHTS
                  </h3>
                  <div className="flex flex-col gap-3">
                    {highlights.map((item, i) => (
                      <motion.div 
                        key={i}
                        className="flex gap-3 items-start"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#FF3B30] mt-1.5 flex-shrink-0" />
                        <span className="text-zinc-400 text-xs font-light leading-snug">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Narrative and Details */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            
            {/* Biography Paragraphs */}
            <div className="flex flex-col gap-6 text-zinc-300 text-md md:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
              {bioLong.map((para, i) => (
                <motion.p 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Philosophy Cards */}
            <div className="flex flex-col gap-6 pt-6 border-t border-zinc-900">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-4">
                // GUIDING DESIGN PRINCIPLES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {philosophy.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="p-5 bg-[#080808] border border-zinc-900 rounded-sm hover:border-zinc-800 transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <span className="text-[#FF3B30] font-mono text-xs block mb-3">0{idx + 1}.</span>
                    <h4 className="font-display font-semibold text-white text-base mb-2 group-hover:text-[#FF3B30] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-light">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Competency Skills Tags */}
            <div className="flex flex-col gap-8 pt-6 border-t border-zinc-900">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
                // CORE COMPETENCIES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-4">
                    <h4 className="font-mono text-[10px] text-[#FF3B30] uppercase tracking-[0.2em] font-bold">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((skill, index) => (
                        <motion.span 
                          key={index} 
                          className="bg-zinc-950 hover:bg-[#FF3B30]/10 text-zinc-400 hover:text-white transition-all duration-300 border border-zinc-900 hover:border-zinc-700 rounded-none px-3 py-1 font-mono text-[11px] cursor-default"
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Timeline */}
            <div className="flex flex-col gap-6 pt-6 border-t border-zinc-900">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
                // CAREER PATHWAY
              </h3>
              <div className="flex flex-col gap-2">
                {timeline.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex flex-col py-6 border-b border-zinc-900 hover:bg-zinc-950/50 px-4 transition-colors duration-300"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-2 mb-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-display text-base md:text-lg font-bold text-white tracking-tight">
                          {item.role}
                        </h4>
                        <span className="font-mono text-xs text-[#FF3B30] uppercase tracking-widest font-semibold italic">
                          @ {item.company}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900/50 px-2 py-1 border border-zinc-800">
                        {item.year}
                      </span>
                    </div>

                    {item.details && (
                      <ul className="flex flex-col gap-2.5 ml-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex gap-3 items-start group">
                            <span className="w-1 h-1 rounded-full bg-zinc-700 mt-2 transition-colors group-hover:bg-[#FF3B30] flex-shrink-0" />
                            <span className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed tracking-wide">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
