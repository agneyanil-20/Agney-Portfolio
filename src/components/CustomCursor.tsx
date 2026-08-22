/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Responsive, crisp spring tracking with zero noticeable lag and no bounce
  const springConfig = { damping: 35, stiffness: 800, mass: 0.15 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check and disable custom cursor completely on touch devices
    if (typeof window !== "undefined") {
      const touchMatch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      if (touchMatch) {
        setIsTouchDevice(true);
        return;
      }
    }

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target
        ? (target.closest("a, button, [data-cursor], [role='button'], .cursor-pointer, input, select, textarea") as HTMLElement)
        : null;

      setIsHovered(Boolean(interactiveEl));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 rounded-full z-[99999] pointer-events-none bg-[#000000] border-0 outline-none select-none shadow-none"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isHovered ? 8 : 6,
        height: isHovered ? 8 : 6,
      }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
    />
  );
}
