/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import PhotographySection from "./components/PhotographySection";
import ExperimentsSection from "./components/ExperimentsSection";
import CustomCursor from "./components/CustomCursor";
import NoiseBackground from "./components/NoiseBackground";
import HandScrollNav from "./components/HandScrollNav";

const SUN_PIXELS = [
  0, 0, 1, 0, 0, 1, 0, 0,
  0, 1, 0, 1, 1, 0, 1, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  1, 0, 1, 1, 1, 1, 0, 1,
  0, 1, 0, 1, 1, 0, 1, 0,
  0, 0, 1, 0, 0, 1, 0, 0
];

const MOON_PIXELS = [
  0, 0, 1, 1, 1, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 0, 0,
  1, 1, 1, 1, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 1, 1, 1, 0, 0, 0
];

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("portfolio-theme") as "dark" | "light") || "dark";
    }
    return "dark";
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
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <div id="app-canvas" className="relative min-h-screen bg-black text-white selection:bg-[#FF3B30] selection:text-white transition-colors duration-500">
      {/* Subtle Analog Grain Noise Overlay */}
      <NoiseBackground />

      {/* Modern Cursor Tracking Coordinates system */}
      <CustomCursor />

      {/* Floating Hand Scroll Touchless Navigation controller */}
      <HandScrollNav />

      {/* Subtle Floating High-contrast Brutalist Theme Toggle */}
      <div className="fixed top-6 right-6 md:top-8 md:right-12 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="group focus:outline-none p-1.5 border border-zinc-800 hover:border-[#FF3B30] bg-[#0c0c0c] shadow-lg rounded-none transition-all duration-300 cursor-pointer select-none theme-toggle keep-dark"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          data-cursor="interactive"
        >
          {theme === "dark" ? (
            /* Sun Icon</em> */
            <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
              {SUN_PIXELS.map((p, i) => (
                <div
                  key={`sun-${i}`}
                  className={`w-full h-full ${
                    p === 1 ? "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          ) : (
            /* Moon Icon */
            <div className="grid grid-cols-8 gap-[1px] w-[18px] h-[18px]">
              {MOON_PIXELS.map((p, i) => (
                <div
                  key={`moon-${i}`}
                  className={`w-full h-full ${
                    p === 1 ? "bg-white group-hover:bg-[#FF3B30] transition-colors duration-300" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Main Sections Hierarchy */}
      <main className="relative flex flex-col w-full">
        {/* Fullscreen Hero Cover Paragraph */}
        <HeroSection onNavigate={handleNavigate} />

        {/* Section 1: about -> triggers scrolling from "I" */}
        <AboutSection />

        {/* Section 2: projects -> triggers scrolling from "Work" */}
        <ProjectsSection />

        {/* Section 3: photography -> triggers scrolling from "Photography" */}
        <PhotographySection />

        {/* Section 4: explorations -> triggers scrolling from "explorations" */}
        <ExperimentsSection />
      </main>

      {/* Simple, Ultra-Minimalist Baseline Bottom Footer */}
      <footer className="w-full bg-black py-16 px-6 md:px-12 lg:px-24 border-t border-zinc-950 font-mono text-[10px] text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          <a 
            href="https://www.instagram.com/agney__anil_kallil?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#FF3B30] transition-colors duration-200 tracking-wider flex items-center gap-1 focus:outline-none"
          >
            INSTAGRAM //
          </a>
          <a 
            href="https://wa.me/917907939730" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#FF3B30] transition-colors duration-200 tracking-wider flex items-center gap-1 focus:outline-none"
          >
            WHATSAPP REDIRECT //
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
