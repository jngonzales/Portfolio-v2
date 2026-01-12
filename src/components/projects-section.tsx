"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import projectsData from "@/data/projects.json";
import { useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import Image from "next/image";
import { useAIHint } from "@/components/ai-hint-provider";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  codeUrl: string;
  featured: boolean;
}

const projects: Project[] = projectsData.projects;

// Architecture data for each project
const architectures: Record<number, { layers: { label: string; items: string[]; color: string }[] }> = {
  1: { // DealFlow
    layers: [
      { label: "Frontend", items: ["Next.js", "React Query"], color: "from-blue-500/20 to-blue-600/10" },
      { label: "API", items: ["FastAPI", "Python", "Pydantic"], color: "from-yellow-500/20 to-yellow-600/10" },
      { label: "Database", items: ["PostgreSQL", "SQLAlchemy"], color: "from-purple-500/20 to-purple-600/10" },
    ]
  },
  2: { // Portfolio
    layers: [
      { label: "Frontend", items: ["Next.js 15", "React 19", "Framer"], color: "from-blue-500/20 to-blue-600/10" },
      { label: "Build", items: ["Static MDX", "Turbopack"], color: "from-green-500/20 to-green-600/10" },
      { label: "Deploy", items: ["Vercel Edge", "CDN"], color: "from-purple-500/20 to-purple-600/10" },
    ]
  },
  3: { // LinkHub
    layers: [
      { label: "Frontend", items: ["Next.js App Router", "TypeScript", "Tailwind"], color: "from-blue-500/20 to-blue-600/10" },
      { label: "Backend", items: ["PostgreSQL", "Auth", "Real-time"], color: "from-green-500/20 to-green-600/10" },
      { label: "Database", items: ["Row Level Security", "Edge Functions"], color: "from-purple-500/20 to-purple-600/10" },
    ]
  },
};

function ArchitectureDiagram({ projectId }: { projectId: number }) {
  const arch = architectures[projectId];
  if (!arch) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-20 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-mono">Architecture</p>
      <div className="flex items-center gap-2 w-full max-w-xs">
        {arch.layers.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-1 flex-1">
            <div className={`bg-linear-to-br ${layer.color} rounded-lg p-2 border border-border/50 flex-1`}>
              <p className="text-[9px] font-bold text-center mb-1">{layer.label}</p>
              {layer.items.map((item) => (
                <p key={item} className="text-[8px] text-muted-foreground text-center">{item}</p>
              ))}
            </div>
            {i < arch.layers.length - 1 && (
              <ArrowRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const [imageError, setImageError] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const hasImage = project.image && project.image.trim() !== "" && !imageError;
  
  // AI Hint integration
  const aiHint = useAIHint();
  const setHoveredProject = aiHint?.setHoveredProject ?? null;
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Glare effect position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    // Trigger AI hint on hover
    if (setHoveredProject) {
      setHoveredProject(project.id, project.title);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // Clear AI hint when leaving
    if (setHoveredProject) {
      setHoveredProject(null);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`group relative bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 ${
        project.featured ? "md:col-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={isTouchDevice ? undefined : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare Effect - Only on non-touch devices */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(168, 85, 247, 0.15), transparent 40%)`,
          }}
        />
      )}
      {/* Project Image with Fallback or Architecture Diagram */}
      <div 
        className="relative h-48 bg-linear-to-br from-primary/10 via-secondary/20 to-accent/10 overflow-hidden"
        style={isTouchDevice ? undefined : { transform: "translateZ(20px)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)]" />
        
        {/* Architecture Diagram Overlay */}
        <AnimatePresence>
          {showArchitecture && <ArchitectureDiagram projectId={project.id} />}
        </AnimatePresence>
        
        {/* Show Image if available, otherwise styled placeholder */}
        {!showArchitecture && (
          hasImage ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Dynamic gradient based on project */}
              <div className={`absolute inset-0 ${
                project.id === 1 ? "bg-linear-to-br from-emerald-600/30 via-teal-500/20 to-cyan-500/10" :
                project.id === 2 ? "bg-linear-to-br from-orange-600/30 via-amber-500/20 to-yellow-500/10" :
                "bg-linear-to-br from-violet-600/30 via-purple-500/20 to-fuchsia-500/10"
              }`} />
              {/* Project branding */}
              <div className="relative z-10 text-center">
                <div className={`text-4xl font-black tracking-tighter mb-2 ${
                  project.id === 1 ? "text-emerald-400/80" :
                  project.id === 2 ? "text-orange-400/80" :
                  "text-violet-400/80"
                }`}>
                  {project.title.charAt(0)}
                </div>
                <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
                  {project.id === 1 ? "Link Management" : project.id === 2 ? "Deal Pipeline" : "Portfolio"}
                </p>
              </div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }} />
            </div>
          )
        )}
        
        {/* Blueprint Toggle Button */}
        {architectures[project.id] && (
          <button
            onClick={() => setShowArchitecture(!showArchitecture)}
            className={`absolute top-3 right-3 z-30 p-2 rounded-lg transition-colors ${
              showArchitecture 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
            title={showArchitecture ? "Show Preview" : "Show Architecture"}
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
        
        {/* Hover Overlay - Only show when not in architecture view */}
        {!showArchitecture && (
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <Button asChild size="sm" variant="secondary">
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                Code
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6" style={isTouchDevice ? undefined : { transform: "translateZ(30px)" }}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2 border-t border-border/50">
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>Source</span>
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Demo</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured);
  
  return (
    <section className="container mx-auto px-4 py-24" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Production-ready SaaS and web applications I&apos;ve architected and shipped.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
