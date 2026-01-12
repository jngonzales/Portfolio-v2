"use client";

import { motion } from "framer-motion";
import { AboutCard } from "./about-card";
import { TechStackCard } from "./tech-stack-card";
import { CertificatesCard } from "./certificates-card";
import { TerminalCard } from "./terminal-card";

export function BentoGrid() {
  return (
    <section className="container mx-auto px-4 py-24" id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Full Stack Engineer • Harvard CS50x • 7× HackerRank Certified
        </p>
      </motion.div>

      {/* Bento Grid - Clean Layout with Bottom Console */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Row 1: About (2/4) + Tech Stack (2/4) */}
        <div className="md:col-span-2">
          <AboutCard />
        </div>
        <div className="md:col-span-2">
          <TechStackCard />
        </div>
        
        {/* Row 2: Certificates - Full Width */}
        <div className="md:col-span-4">
          <CertificatesCard />
        </div>

        {/* Row 3: Terminal - Full Width Bottom Console */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <span className="font-mono">▶</span>
            <span>Interactive Terminal</span>
            <span className="text-xs opacity-60">— type &apos;help&apos; to explore</span>
          </div>
          <div className="h-[300px]">
            <TerminalCard />
          </div>
        </div>
      </div>
    </section>
  );
}
