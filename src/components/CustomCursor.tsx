/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Position motion states using springs for buttery smooth weight physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 45, stiffness: 450, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target 
        ? (target.closest("a, button, [data-cursor], [role='button'], .cursor-pointer") as HTMLElement) 
        : null;

      if (interactiveEl) {
        setIsHovered(true);
        const type = interactiveEl.getAttribute("data-cursor") || 
                     (interactiveEl.tagName === "A" || interactiveEl.tagName === "BUTTON" ? "interactive" : "pointer");
        setHoverType(type);

        // Calculate magnetic sticky coordinates
        const rect = interactiveEl.getBoundingClientRect();
        
        // Only trigger magnetic pull if the element is of standard interactive size (e.g., width < 320px and height < 200px)
        const isSmallInteractive = rect.width < 320 && rect.height < 200;

        if (isSmallInteractive) {
          // Center of the target element
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Magnetic pull factor: 55% pull creates a solid "sticky" pull effect
          const pullFactor = 0.55;
          const targetX = e.clientX + (centerX - e.clientX) * pullFactor;
          const targetY = e.clientY + (centerY - e.clientY) * pullFactor;

          cursorX.set(targetX);
          cursorY.set(targetY);
        } else {
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
        }
      } else {
        setIsHovered(false);
        setHoverType(null);

        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full z-50 pointer-events-none mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? (hoverType === "interactive" ? 2.5 : 1.8) : 1,
          backgroundColor: isHovered && hoverType === "interactive" ? "#FF3B30" : "#FFFFFF"
        }}
        transition={{ type: "tween", duration: 0.15 }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white rounded-full z-50 pointer-events-none opacity-40 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? (hoverType === "interactive" ? 1.6 : 1.3) : 1,
          borderColor: isHovered && hoverType === "interactive" ? "#FF3B30" : "#FFFFFF",
          opacity: isHovered ? 0.7 : 0.4
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
