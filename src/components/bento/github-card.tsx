"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, GitCommitHorizontal, Star, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import { getGitHubStats } from "@/lib/github";

interface GitHubStats {
  totalContributions: number;
  repositories: number;
  followers: number;
}

// Generate a mock contribution grid (7 days x 5 weeks = 35 cells)
function generateContributionGrid(): number[] {
  const grid: number[] = [];
  for (let i = 0; i < 35; i++) {
    // Weight towards lower contributions with occasional spikes
    const rand = Math.random();
    if (rand > 0.9) grid.push(4);       // High activity
    else if (rand > 0.7) grid.push(3);  // Medium-high
    else if (rand > 0.5) grid.push(2);  // Medium
    else if (rand > 0.25) grid.push(1); // Low
    else grid.push(0);                   // None
  }
  return grid;
}

const contributionColors = [
  "bg-[#161b22]",       // 0 - none
  "bg-[#0e4429]",       // 1 - low
  "bg-[#006d32]",       // 2 - medium
  "bg-[#26a641]",       // 3 - medium-high
  "bg-[#39d353]",       // 4 - high
];

export function GithubCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contributionGrid] = useState(() => generateContributionGrid());
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getGitHubStats();
      if (data) {
        setStats({
          totalContributions: data.totalContributions,
          repositories: data.repositories,
          followers: data.followers,
        });
      }
    };
    fetchStats();
  }, []);

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
      className="group col-span-1 row-span-1 bg-card rounded-3xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
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
      
      <div className="flex items-center gap-3 mb-4" style={isTouchDevice ? undefined : { transform: "translateZ(20px)" }}>
        <div className="p-2 bg-primary/10 rounded-xl">
          <Github className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">GitHub</h3>
      </div>

      {/* Contribution Grid - GitHub Style */}
      <div className="mb-4" style={isTouchDevice ? undefined : { transform: "translateZ(18px)" }}>
        <div className="grid grid-cols-7 gap-1">
          {contributionGrid.map((level, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-sm ${contributionColors[level]}`}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.01, duration: 0.2 }}
              viewport={{ once: true }}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-right">Last 5 weeks</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4" style={isTouchDevice ? undefined : { transform: "translateZ(15px)" }}>
        <div className="text-center p-2 bg-secondary/30 rounded-xl">
          <GitCommitHorizontal className="h-4 w-4 text-green-400 mx-auto mb-1" />
          <p className="text-xs font-bold text-green-400">{stats ? stats.totalContributions.toLocaleString() : "---"}</p>
          <p className="text-[9px] text-muted-foreground">Commits</p>
        </div>
        <div className="text-center p-2 bg-secondary/30 rounded-xl">
          <GitBranch className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-xs font-bold text-yellow-400">{stats ? stats.repositories : "---"}</p>
          <p className="text-[9px] text-muted-foreground">Repos</p>
        </div>
        <div className="text-center p-2 bg-secondary/30 rounded-xl">
          <Star className="h-4 w-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs font-bold text-blue-400">{stats ? stats.followers : "---"}</p>
          <p className="text-[9px] text-muted-foreground">Followers</p>
        </div>
      </div>

      <div style={isTouchDevice ? undefined : { transform: "translateZ(10px)" }}>
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href="https://github.com/jngonzales" target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
