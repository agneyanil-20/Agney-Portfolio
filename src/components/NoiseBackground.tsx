/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

export default function NoiseBackground() {
  const [opacity, setOpacity] = useState(0.04);

  // Subtle natural pulse of grain opacity
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0.035 + Math.random() * 0.015);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
      <svg className="w-full h-full opacity-100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
