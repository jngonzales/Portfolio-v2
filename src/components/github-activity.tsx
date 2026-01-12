"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, GitCommit, Star, GitFork, Code2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Sample activity data - in production, this would come from GitHub API
const activityData = [
  { day: "Mon", commits: 3 },
  { day: "Tue", commits: 7 },
  { day: "Wed", commits: 5 },
  { day: "Thu", commits: 12 },
  { day: "Fri", commits: 8 },
  { day: "Sat", commits: 4 },
  { day: "Sun", commits: 2 },
];

const stats = {
  totalCommits: 847,
  totalRepos: 42,
  totalStars: 156,
  totalForks: 38,
};

const recentRepos = [
  { name: "portfolio-2026", language: "TypeScript", stars: 12 },
  { name: "qr-nexus", language: "Python", stars: 34 },
  { name: "dealflow", language: "Next.js", stars: 28 },
];

export function GitHubActivityCard() {
  return (
    <Card className="col-span-1 md:col-span-2 overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Activity
        </CardTitle>
        <a
          href="https://github.com/jngonzales"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          @jngonzales
        </a>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-primary">{stats.totalCommits}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <GitCommit className="h-3 w-3" />
              Commits
            </div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-primary">{stats.totalRepos}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Code2 className="h-3 w-3" />
              Repos
            </div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-primary">{stats.totalStars}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Star className="h-3 w-3" />
              Stars
            </div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl font-bold text-primary">{stats.totalForks}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <GitFork className="h-3 w-3" />
              Forks
            </div>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <div className="h-32" style={{ minWidth: 200, minHeight: 100 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={100}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium">{payload[0].value} commits</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorCommits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Repos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Repositories</h4>
          {recentRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{repo.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {repo.language}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3 w-3" />
                <span className="text-xs">{repo.stars}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
