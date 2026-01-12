"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Terminal, Circle } from "lucide-react";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import { useUI } from "@/components/page-wrapper";

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help     - Show this help message",
    "  about    - Learn about JN",
    "  skills   - View tech skills",
    "  contact  - Get contact info",
    "  projects - View featured projects",
    "  matrix   - Toggle Matrix mode 🔴",
    "  clear    - Clear terminal",
  ],
  about: [
    "╔══════════════════════════════════════╗",
    "║  JN Gonzales                         ║",
    "║  Full Stack Developer                ║",
    "║  Cavite, Philippines                 ║",
    "╚══════════════════════════════════════╝",
    "",
    "Full Stack Engineer specializing in",
    "SaaS products and scalable web applications.",
  ],
  skills: [
    "Frontend:  Next.js, React, TypeScript, Tailwind",
    "Backend:   Python, Django, FastAPI, Go, Node.js",
    "Database:  PostgreSQL, Redis, MongoDB",
    "DevOps:    Docker, Vercel, AWS, Linux",
    "Tools:     Git, Figma, Postman",
  ],
  contact: [
    "📧 Email: jngonzales.dev@gmail.com",
    "🔗 GitHub: github.com/jngonzales",
    "💼 LinkedIn: linkedin.com/in/jn-gonzales",
  ],
  projects: [
    "Featured Projects:",
    "",
    "1. DealFlow - B2B Lead Intelligence Platform",
    "2. Portfolio - Interactive SaaS-style portfolio",
    "3. LinkHub - Open-source Linktree alternative",
    "",
    "Visit the Projects section for more details.",
  ],
};

export function TerminalCard() {
  const { toggleMatrixMode, matrixMode } = useUI();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: 'Welcome to JN\'s Terminal. Type "help" to start.' },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
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

  // Auto-scroll to bottom when new lines added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add input line
    const newLines: TerminalLine[] = [
      ...lines,
      { type: "input", content: `$ ${cmd}` },
    ];

    if (trimmedCmd === "clear") {
      setLines([{ type: "output", content: 'Terminal cleared. Type "help" for commands.' }]);
      return;
    }

    if (trimmedCmd === "matrix") {
      toggleMatrixMode();
      if (matrixMode) {
        newLines.push({ type: "output", content: "Matrix mode: DISABLED" });
        newLines.push({ type: "output", content: "Returning to normal reality..." });
      } else {
        newLines.push({ type: "output", content: "Initializing matrix_simulation.exe..." });
        newLines.push({ type: "output", content: "Accessing mainframe... [ACCESS GRANTED]" });
        newLines.push({ type: "output", content: "Matrix mode: ENABLED 🔴" });
      }
      setLines(newLines);
      return;
    }

    if (trimmedCmd === "") {
      setLines(newLines);
      return;
    }

    const output = COMMANDS[trimmedCmd];
    if (output) {
      output.forEach((line) => {
        newLines.push({ type: "output", content: line });
      });
    } else {
      newLines.push({ type: "output", content: `Command not found: ${cmd}` });
      newLines.push({ type: "output", content: 'Type "help" for available commands.' });
    }

    setLines(newLines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <motion.div
      ref={cardRef}
      className="group h-full max-h-[300px] bg-[#1a1a2e] rounded-3xl border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.01 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={isTouchDevice ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={focusInput}
    >
      {/* Glare Effect */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(139, 92, 246, 0.1), transparent 40%)`,
          }}
        />
      )}

      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f1a] border-b border-border/30">
        <div className="flex gap-1.5">
          <Circle className="h-3 w-3 fill-red-500 text-red-500" />
          <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <Circle className="h-3 w-3 fill-green-500 text-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          <span>jn@portfolio:~</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        data-lenis-prevent
        className="flex-1 min-h-0 overflow-y-auto p-4 font-mono text-sm cursor-text terminal-scrollbar smooth-inner-scroll"
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={`${
              line.type === "input"
                ? "text-green-400"
                : "text-gray-300"
            } whitespace-pre-wrap`}
          >
            {line.content}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center text-green-400">
          <span className="mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="animate-pulse">▋</span>
        </form>
      </div>
    </motion.div>
  );
}
