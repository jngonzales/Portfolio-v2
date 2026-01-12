"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, CodeXml, GraduationCap, Briefcase, Award, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";

// Timeline events
const timelineEvents = [
  {
    year: "2025",
    title: "CS50x Certification",
    description: "Harvard University",
    icon: GraduationCap,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
  },
  {
    year: "2025",
    title: "DealFlow SaaS",
    description: "Real Estate Platform",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    year: "2025",
    title: "HackerRank Certs",
    description: "7 Certifications",
    icon: Award,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    year: "2025",
    title: "Portfolio Launch",
    description: "This website!",
    icon: CodeXml,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
];

export function AboutCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group col-span-1 md:col-span-2 h-full bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.01 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={isTouchDevice ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare Effect - Only on non-touch devices */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(168, 85, 247, 0.1), transparent 40%)`,
          }}
        />
      )}
      
      <div className="flex items-start gap-4 mb-6" style={isTouchDevice ? undefined : { transform: "translateZ(20px)" }}>
        <div className="p-3 bg-primary/10 rounded-2xl">
          <CodeXml className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">Full Stack Engineer</h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            <span>Cavite, Philippines</span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground leading-relaxed mb-6" style={isTouchDevice ? undefined : { transform: "translateZ(15px)" }}>
        I build SaaS products, internal tools, and data-driven dashboards. My focus is on 
        shipping maintainable code that solves real problems—whether it&apos;s a deal management 
        platform or a high-performance web app serving thousands of users.
      </p>

      {/* Interactive Timeline */}
      <div className="relative" style={isTouchDevice ? undefined : { transform: "translateZ(10px)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-[18px]" />
        <div className="space-y-3">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isHovered = hoveredEvent === index;
            
            return (
              <motion.div
                key={index}
                className="relative flex items-center gap-4 cursor-pointer group/event"
                onMouseEnter={() => setHoveredEvent(index)}
                onMouseLeave={() => setHoveredEvent(null)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 p-2 rounded-full ${event.bgColor} border-2 border-background transition-transform ${isHovered ? "scale-110" : ""}`}>
                  <Icon className={`h-3 w-3 ${event.color}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{event.year}</span>
                    <ChevronRight className={`h-3 w-3 text-muted-foreground/50 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
                  </div>
                  <p className={`text-sm font-medium truncate ${isHovered ? "text-foreground" : "text-muted-foreground"} transition-colors`}>
                    {event.title}
                  </p>
                </div>
                
                {/* Description (visible on hover) */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  className="text-xs text-muted-foreground whitespace-nowrap hidden md:block"
                >
                  {event.description}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
