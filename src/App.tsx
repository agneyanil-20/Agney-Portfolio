/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Instagram, MessageSquare, Globe } from "lucide-react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import PhotographySection from "./components/PhotographySection";
import CustomCursor from "./components/CustomCursor";
import NoiseBackground from "./components/NoiseBackground";
import HandScrollNav from "./components/HandScrollNav";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-theme-v2") as "dark" | "light";
      if (saved === "dark" || saved === "light") return saved;
    }
    return "light";
  });
  
  // Custom scroll target alignment function for editorial storytelling navigation
  const handleNavigate = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      // Direct scroll coordinate query representing Aino's fluid aesthetic
      const yOffset = -20; // Slight spacing offset to avoid overlapping border limits
      const yCoordinate = sectionElement.getBoundingClientRect().top + window.scrollY + yOffset;
      
      window.scrollTo({
        top: yCoordinate,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("portfolio-theme-v2", theme);
  }, [theme]);

  // Dynamic document title based on section in view
  useEffect(() => {
    const sectionTitles: Record<string, string> = {
      hero: "Home",
      about: "About",
      projects: "Work",
      photography: "Photography"
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const title = sectionTitles[entry.target.id];
          if (title) {
            document.title = `Agney Anil | ${title}`;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-45% 0px -45% 0px", 
      threshold: 0
    });

    Object.keys(sectionTitles).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div id="app-canvas" className="relative min-h-screen bg-black bg-dot-grid text-white selection:bg-[#FF3B30] selection:text-white transition-colors duration-500">
      {/* Subtle Analog Grain Noise Overlay */}
      <NoiseBackground />

      {/* Modern Cursor Tracking Coordinates system */}
      <CustomCursor />

      {/* Floating Hand Scroll Touchless Navigation & Theme controls */}
      <HandScrollNav theme={theme} setTheme={setTheme} />

      {/* Main Sections Hierarchy */}
      <main className="relative flex flex-col w-full pb-8">
        {/* Fullscreen Hero Cover Paragraph */}
        <HeroSection onNavigate={handleNavigate} />

        {/* Section 1: about -> triggers scrolling from "I" */}
        <AboutSection />

        {/* Section 2: projects -> triggers scrolling from "Work" */}
        <ProjectsSection />

        {/* Section 3: photography -> triggers scrolling from "Photography" */}
        <PhotographySection />
      </main>

      {/* Simple, Ultra-Minimalist Baseline Bottom Footer */}
      <footer className="w-full bg-transparent py-8 px-6 md:px-12 lg:px-24 border-t border-zinc-950 font-mono text-[10px] text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <a 
            href="https://www.instagram.com/agney__anil_kallil?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#FF3B30] px-6 py-4 hover:bg-white transition-all duration-500 focus:outline-none"
            data-cursor="interactive"
          >
            <Instagram className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span className="text-black tracking-[0.2em] uppercase font-black text-[10px]">Instagram</span>
          </a>

          <a 
            href="https://www.behance.net/agneyanil" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#FF3B30] px-6 py-4 hover:bg-white transition-all duration-500 focus:outline-none"
            data-cursor="interactive"
          >
            <Globe className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span className="text-black tracking-[0.2em] uppercase font-black text-[10px]">Behance</span>
          </a>

          <a 
            href="https://wa.me/917907939730" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#FF3B30] px-6 py-4 hover:bg-white transition-all duration-500 focus:outline-none"
            data-cursor="interactive"
          >
            <MessageSquare className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span className="text-black tracking-[0.2em] uppercase font-black text-[10px]">WhatsApp</span>
          </a>
        </div>
        <div className="flex flex-col md:items-end gap-1 text-center md:text-right">
          <span>© 2026 AGNEY. BRUTALIST SCANDINAVIAN GRAPHICS.</span>
          <span className="text-zinc-700">TYPESET AND ENGRAVED VIA CODING SYNTAX IN STOCKHOLM SE.</span>
        </div>
      </footer>
    </div>
  );
}
