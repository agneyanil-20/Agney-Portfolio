/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MapPin } from "lucide-react";

export default function AboutSection() {
  const { name, role, location, coordinates, bioLong, philosophy, skills, timeline } = PORTFOLIO_DATA.about;

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
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
              / THE PROFILE & PHILOSOPHY
            </div>
          </div>
          <div className="text-right font-mono text-zinc-400 text-xs md:text-sm flex flex-col md:items-end">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF3B30]" /> {location}</span>
            <span className="text-zinc-600">{coordinates}</span>
          </div>
        </div>

        {/* Swiss Two-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Editorial Monochromatic Photo Grid */}
          <div className="lg:col-span-5 flex flex-col gap-8">
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-8 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">NAME</span>
                <span className="text-white text-sm font-medium">{name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">ROLE</span>
                <span className="text-white text-sm font-medium">{role}</span>
              </div>
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
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
                // TECHNICAL COMPETENCIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="bg-zinc-900 hover:bg-[#FF3B30]/10 text-white hover:text-[#FF3B30] transition-all duration-300 border border-zinc-800 rounded-none px-4 py-1.5 font-mono text-xs cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Professional Timeline */}
            <div className="flex flex-col gap-6 pt-6 border-t border-zinc-900">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
                // CAREER PATHWAY
              </h3>
              <div className="flex flex-col">
                {timeline.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex grid grid-cols-1 md:grid-cols-12 py-4 border-b border-zinc-950 hover:bg-zinc-950 px-2 transition-colors duration-200 items-baseline gap-2"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="md:col-span-3 font-mono text-xs text-zinc-500">
                      {item.year}
                    </div>
                    <div className="md:col-span-5 font-display text-sm font-semibold text-white">
                      {item.role}
                    </div>
                    <div className="md:col-span-4 font-mono text-xs text-zinc-400 md:text-right">
                      {item.company}
                    </div>
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
