"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import { 
  Zap, 
  Atom, 
  FileCode, 
  Terminal,
  Rocket,
  Server,
  Database,
  Link,
  Wind,
  Hexagon,
  GitBranch,
  Cpu,
  Box,
  Cloud,
  Triangle,
  MonitorCog,
  Figma,
  Send,
  Sparkles,
  RefreshCw,
  Shield,
  Palette
} from "lucide-react";

interface TechItem {
  name: string;
  icon: ReactNode;
}

const techStack: TechItem[] = [
  // Core Frameworks
  { name: "Next.js", icon: <Zap className="h-5 w-5" /> },
  { name: "React", icon: <Atom className="h-5 w-5" /> },
  { name: "TypeScript", icon: <FileCode className="h-5 w-5" /> },
  { name: "Python", icon: <Terminal className="h-5 w-5" /> },
  { name: "Django", icon: <Server className="h-5 w-5" /> },
  { name: "FastAPI", icon: <Rocket className="h-5 w-5" /> },
  { name: "Go", icon: <Cpu className="h-5 w-5" /> },
  { name: "SQL", icon: <Database className="h-5 w-5" /> },
  { name: "REST APIs", icon: <Link className="h-5 w-5" /> },
  { name: "Tailwind", icon: <Wind className="h-5 w-5" /> },
  { name: "Node.js", icon: <Hexagon className="h-5 w-5" /> },
  { name: "Git", icon: <GitBranch className="h-5 w-5" /> },
  // Infrastructure
  { name: "Docker", icon: <Box className="h-5 w-5" /> },
  { name: "Supabase", icon: <Database className="h-5 w-5" /> },
  { name: "Vercel", icon: <Triangle className="h-5 w-5" /> },
  { name: "AWS", icon: <Cloud className="h-5 w-5" /> },
  // Tools
  { name: "Linux", icon: <MonitorCog className="h-5 w-5" /> },
  { name: "Figma", icon: <Figma className="h-5 w-5" /> },
  { name: "Postman", icon: <Send className="h-5 w-5" /> },
  // Libraries
  { name: "Framer Motion", icon: <Sparkles className="h-5 w-5" /> },
  { name: "React Query", icon: <RefreshCw className="h-5 w-5" /> },
  { name: "Zod", icon: <Shield className="h-5 w-5" /> },
  { name: "Shadcn UI", icon: <Palette className="h-5 w-5" /> },
];

export function TechStackCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  
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
      className="group col-span-1 row-span-1 h-full min-h-full bg-card rounded-3xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={isTouchDevice ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare Effect - Only on non-touch devices */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(6, 182, 212, 0.1), transparent 40%)`,
          }}
        />
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Tech Stack</h3>
          <p className="text-xs text-muted-foreground">{techStack.length} technologies</p>
        </div>
      </div>
      
      {/* Marquee Container - Centered vertically */}
      <div className="relative flex-1 flex flex-col justify-center">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-card to-transparent z-10" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-card to-transparent z-10" />
        
        {/* Marquee Track - Row 1 */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: "-50%" }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {/* Duplicate the list for seamless loop */}
            {[...techStack, ...techStack].map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full whitespace-nowrap shrink-0"
              >
                <span className="text-primary">{tech.icon}</span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Reverse Direction */}
        <div className="flex overflow-hidden mt-3">
          <motion.div
            className="flex gap-4"
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, index) => (
              <div
                key={`${tech.name}-rev-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full whitespace-nowrap shrink-0"
              >
                <span className="text-primary">{tech.icon}</span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Third Row - Same as first, different speed */}
        <div className="flex overflow-hidden mt-3">
          <motion.div
            className="flex gap-4"
            animate={{ x: "-50%" }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...techStack.slice(8), ...techStack.slice(0, 8), ...techStack.slice(8), ...techStack.slice(0, 8)].map((tech, index) => (
              <div
                key={`${tech.name}-third-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full whitespace-nowrap shrink-0"
              >
                <span className="text-primary">{tech.icon}</span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Skill Level Legend */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Core Focus</p>
        <div className="flex flex-wrap gap-1">
          {["Full Stack", "Backend Architecture", "API Design"].map((skill) => (
            <span key={skill} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
