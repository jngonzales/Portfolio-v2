"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

const bootSequence = [
  { text: "> initializing portfolio...", delay: 0 },
  { text: "> loading next.js 16.1.1...", delay: 150 },
  { text: "> importing react 19.2.3...", delay: 250 },
  { text: "> configuring tailwind v4...", delay: 200 },
  { text: "> initializing three.js scene...", delay: 300 },
  { text: "> verifying credentials...", delay: 400 },
  { text: "  ├── CS50x [HARVARD] ✓", delay: 100 },
  { text: "  ├── CS50P [HARVARD] ✓", delay: 80 },
  { text: "  └── 9 more certifications ✓", delay: 80 },
  { text: "> connecting services...", delay: 200 },
  { text: "  ├── postgres: ready", delay: 100 },
  { text: "  ├── openrouter: connected", delay: 100 },
  { text: "  └── github: ready", delay: 100 },
  { text: "> compiling components...", delay: 300 },
  { text: "> starting development server...", delay: 400 },
  { text: "", delay: 100 },
  { text: "  ▲ Next.js 16.1.1 (Turbopack)", delay: 150 },
  { text: "  - Local: http://localhost:3000", delay: 100 },
  { text: "", delay: 100 },
  { text: "  ✓ Ready in 847ms", delay: 300 },
];

export function Loader({ onComplete }: LoaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let totalDelay = 300; // Initial delay
    const timers: NodeJS.Timeout[] = [];
    
    bootSequence.forEach((item, index) => {
      totalDelay += item.delay;
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, item.text]);
        
        if (index === bootSequence.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 600);
          }, 500);
        }
      }, totalDelay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] text-green-500 font-mono overflow-hidden"
        >
          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)"
            }}
          />
          
          {/* CRT vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)"
            }}
          />
          
          {/* Terminal content */}
          <div className="relative h-full flex flex-col p-6 md:p-10 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-900/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-4 text-green-500/60 text-sm">jn@portfolio ~ npm run dev</span>
            </div>
            
            {/* Boot lines */}
            <div className="flex-1 overflow-hidden flex flex-col justify-end pb-10">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`text-sm md:text-base leading-relaxed ${
                    line.includes("✓") || line.includes("Ready") 
                      ? "text-green-400" 
                      : line.includes("HARVARD")
                        ? "text-rose-400 font-bold"
                        : line.includes("▲")
                          ? "text-white font-bold"
                          : "text-green-500/80"
                  }`}
                >
                  {line || "\u00A0"}
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-2.5 h-5 bg-green-500 mt-1"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
