/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import PhotographySection from "./components/PhotographySection";
import ExperimentsSection from "./components/ExperimentsSection";
import CustomCursor from "./components/CustomCursor";
import NoiseBackground from "./components/NoiseBackground";

export default function App() {
  
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

  return (
    <div id="app-canvas" className="relative min-h-screen bg-black text-white selection:bg-[#FF3B30] selection:text-white">
      {/* Subtle Analog Grain Noise Overlay */}
      <NoiseBackground />

      {/* Modern Cursor Tracking Coordinates system */}
      <CustomCursor />

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
      <footer className="w-full bg-black py-12 px-6 md:px-12 lg:px-24 border-t border-zinc-950 font-mono text-[10px] text-zinc-600 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <span>© 2026 AGNEY. BRUTALIST SCANDINAVIAN GRAPHICS.</span>
        <span>TYPESET AND ENGRAVED VIA CODING SYNTAX IN STOCKHOLM SE.</span>
      </footer>
    </div>
  );
}
