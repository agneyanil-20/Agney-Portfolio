/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MapPin, Instagram, MessageSquare, BookOpen, ExternalLink, Globe } from "lucide-react";

export default function AboutSection() {
  const { name, role, subRole, location, coordinates, bioShort, bioLong, philosophy, socials } = PORTFOLIO_DATA.about;

  // Calculate estimated reading time based on 200 WPM
  const editorialText = [
    bioShort,
    ...bioLong,
    ...philosophy.flatMap(p => [p.title, p.description])
  ].join(" ");
  const wordCount = editorialText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <motion.section 
      id="about" 
      className="w-full bg-transparent text-white px-6 md:px-12 lg:px-24 py-8 md:py-12 border-t border-zinc-900 overflow-hidden relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-4 text-balance">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
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
            </div>
          </div>

          {/* Right Side: Narrative and Details */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            
            {/* Biography Paragraphs */}
            <div className="flex flex-col gap-5 text-zinc-300 text-md md:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
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

          </div>
        </div>

      </div>
    </motion.section>
  );
}
