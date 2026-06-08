/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { Photo } from "../types";
import { Camera, MapPin, X, ZoomIn, ArrowRight, ArrowLeft } from "lucide-react";

export default function PhotographySection() {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Manual scroll helper buttons for horizontal gallery track
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section 
      id="photography" 
      className="min-h-screen w-full bg-black text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-4">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
              Photography
            </h2>
            <div className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
              / MONOCHROME OBSERVATIONS
            </div>
          </div>
          
          {/* Slider Controllers */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll("left")}
              className="p-3 border border-zinc-800 hover:border-white rounded-full bg-zinc-950 transition-colors text-zinc-400 hover:text-white cursor-pointer"
              title="Scroll Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-3 border border-zinc-800 hover:border-white rounded-full bg-zinc-950 transition-colors text-zinc-400 hover:text-white cursor-pointer"
              title="Scroll Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Drag & Scroll Photographic Track */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-10 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {PORTFOLIO_DATA.photography.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="flex-shrink-0 w-[85vw] sm:w-[450px] md:w-[500px] snap-start border border-zinc-900 bg-zinc-950 hover:border-zinc-800 transition-colors p-4 flex flex-col justify-between select-none relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Photo Image Card */}
              <div 
                className="relative aspect-[3/4] w-full overflow-hidden bg-black mb-4 cursor-pointer"
                onClick={() => setActivePhoto(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 hover:scale-102 transition-transform duration-700 hover:brightness-105"
                  draggable={false}
                />
                
                {/* Micro hover overlay prompt */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-black/80 px-4 py-2 border border-zinc-800 font-mono text-[10px] text-[#FF3B30] tracking-widest flex items-center gap-2">
                    <ZoomIn className="w-3 h-3" /> INSPECT PRINT
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1 font-mono text-[9px] text-zinc-400">
                  REF_0{index + 1}
                </div>
              </div>

              {/* Photo Details Metadata Block */}
              <div className="flex flex-col gap-2 font-mono text-[11px] border-t border-zinc-900 pt-3 text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-white font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF3B30]" /> {photo.location}
                  </span>
                  <span className="text-zinc-500 font-semibold">{photo.date}</span>
                </div>
                <div className="text-zinc-600 text-[10px] tracking-tight">
                  {photo.coordinates}
                </div>
                <p className="font-serif text-sm italic text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                  "{photo.caption}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote information regarding physical hardware specifications */}
        <div className="w-full border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>Camera Gear: Hassleblad 500C / Kodak TRI-X 400 Film</span>
          <span>Archival prints processed in Stockholm darkrooms</span>
        </div>

      </div>

      {/* Cinematic Modal Lightbox Overlay */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 select-none"
            onClick={() => setActivePhoto(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-zinc-400 hover:text-white p-2.5 bg-zinc-950 hover:bg-zinc-900 rounded-full border border-zinc-800 transition-colors z-55"
              title="Close View"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body Container */}
            <div 
              className="max-w-4xl w-full flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()} // Stop closing click propagation
            >
              <div className="relative aspect-[4/3] md:aspect-[3/2] w-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-115"
                />
              </div>

              {/* Lightbox Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono border-t border-zinc-800 pt-4">
                <div className="md:col-span-4 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-zinc-900 pb-3 md:pb-0">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">GEEOGRAPHIC COORDS:</span>
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" /> {activePhoto.location}
                  </span>
                  <span className="text-xs text-zinc-400 font-sans mt-0.5">{activePhoto.coordinates}</span>
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-zinc-900 pb-3 md:pb-0">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">DATE TAKEN:</span>
                  <span className="text-white text-sm font-semibold">{activePhoto.date}</span>
                </div>

                <div className="md:col-span-5 flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#FF3B30] uppercase tracking-wider">OBSERVATION LOG:</span>
                  <p className="font-serif italic text-zinc-300 text-sm leading-relaxed">
                    "{activePhoto.caption}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
