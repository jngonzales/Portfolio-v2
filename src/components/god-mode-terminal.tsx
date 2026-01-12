"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Typing game prompts - hacker-themed code snippets
const TYPING_PROMPTS = [
  "const hack = () => console.log('Access Granted');",
  "npm install --save-dev @types/hacker",
  "git commit -m 'bypassed the mainframe'",
  "ssh root@matrix.io -p 1337",
  "SELECT * FROM users WHERE clearance = 'admin';",
  "docker run -d --name neuromancer alpine",
  "curl -X POST https://api.hack/breach -H 'X-Auth: l33t'",
  "export PATH=$PATH:/usr/local/bin/exploit",
  "python3 -c 'import os; os.system(\"whoami\")'",
  "chmod +x /usr/bin/override && ./override",
];

interface FileSystem {
  [key: string]: {
    type: "file" | "directory";
    content?: string;
    children?: FileSystem;
  };
}

const fileSystem: FileSystem = {
  home: {
    type: "directory",
    children: {
      "about.md": {
        type: "file",
        content: `# About JN Gonzales

Full Stack Engineer | Harvard CS50x Certified

🎓 Education:
- Harvard CS50x Certificate (2025)
- Harvard CS50P Certificate (2025)
- 7× HackerRank Certifications (2025)

💼 Experience:
- Full Stack Development with Next.js, React, Python
- SaaS Architecture & Data-driven Applications
- API Development with FastAPI, REST

📍 Location: Philippines
📧 Email: jngonzales.dev@gmail.com`,
      },
      projects: {
        type: "directory",
        children: {
          "dealflow.md": {
            type: "file",
            content: `# DealFlow CRM
> B2B Lead Intelligence Platform

Tech Stack: Next.js, FastAPI, PostgreSQL, Python
Status: 🟢 Live
Role: Solo Full Stack Engineer

Features:
- Pipeline visualization
- Real-time collaboration
- Advanced analytics
- Email integration`,
          },
          "portfolio.md": {
            type: "file",
            content: `# Portfolio 2026
> Interactive SaaS-style portfolio

Tech Stack: Next.js 16, React 19, Three.js, Framer Motion
Status: 🟢 Live

Features:
- 3D interactive hero
- God Mode terminal (you're in it!)
- AI-powered chatbot
- Command palette (⌘K)`,
          },
          "linkhub.md": {
            type: "file",
            content: `# LinkHub
> Open-source link-in-bio solution

Tech Stack: Next.js, PostgreSQL, TypeScript, Tailwind
Status: 🟢 Live

Features:
- Real-time link analytics
- Custom themes & branding
- QR code generation
- Social media integration`,
          },
        },
      },
      skills: {
        type: "directory",
        children: {
          "frontend.txt": {
            type: "file",
            content: `Frontend Skills
===============
React/Next.js ████████████████████ 95%
TypeScript   ████████████████████ 90%
Tailwind CSS ████████████████████ 95%
Three.js     ████████████████░░░░ 80%
Framer Motion████████████████████ 90%`,
          },
          "backend.txt": {
            type: "file",
            content: `Backend Skills
==============
Python/FastAPI ████████████████████ 90%
Node.js        ████████████████░░░░ 80%
PostgreSQL     ████████████████████ 85%
Redis/Caching  ████████████████░░░░ 80%
REST APIs      ████████████████████ 95%`,
          },
        },
      },
      "resume.pdf": {
        type: "file",
        content: `[Binary File: resume.pdf]
Download: /resume.pdf`,
      },
      "contact.json": {
        type: "file",
        content: `{
  "name": "JN Gonzales",
  "email": "jngonzales.dev@gmail.com",
  "github": "github.com/jngonzales",
  "linkedin": "linkedin.com/in/jn-gonzales",
  "location": "Philippines",
  "available": true
}`,
      },
    },
  },
};

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "ascii" | "success";
  content: string;
  prompt?: string;
}

const ASCII_LOGO = `
   ██╗███╗   ██╗     ██████╗  ██████╗ ███╗   ██╗███████╗ █████╗ ██╗     ███████╗███████╗
   ██║████╗  ██║    ██╔════╝ ██╔═══██╗████╗  ██║╚══███╔╝██╔══██╗██║     ██╔════╝██╔════╝
   ██║██╔██╗ ██║    ██║  ███╗██║   ██║██╔██╗ ██║  ███╔╝ ███████║██║     █████╗  ███████╗
   ██║██║╚██╗██║    ██║   ██║██║   ██║██║╚██╗██║ ███╔╝  ██╔══██║██║     ██╔══╝  ╚════██║
██╗██║██║ ╚████║    ╚██████╔╝╚██████╔╝██║ ╚████║███████╗██║  ██║███████╗███████╗███████║
╚═╝╚═╝╚═╝  ╚═══╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
                                                                                        
                     Full Stack Engineer | Portfolio Terminal v2.0
`;

const INITIAL_LINES: TerminalLine[] = [
  { id: "ascii", type: "ascii", content: ASCII_LOGO },
  { id: "welcome", type: "system", content: "Welcome to God Mode Terminal! Type 'help' for available commands." },
  { id: "hint", type: "system", content: "Try: ls, cd projects, cat about.md, goto projects" },
];

export function GodModeTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [currentInput, setCurrentInput] = useState("");
  const [currentPath, setCurrentPath] = useState(["home"]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Typing game state
  const [typingGameActive, setTypingGameActive] = useState(false);
  const [typingPrompt, setTypingPrompt] = useState("");
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingScore, setTypingScore] = useState(0);
  const [typingRound, setTypingRound] = useState(0);
  const [typingHighScore, setTypingHighScore] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getPrompt = useCallback(() => {
    return `jn@portfolio:~/${currentPath.join("/")}$`;
  }, [currentPath]);

  const getCurrentDirectory = useCallback((): FileSystem | undefined => {
    let current: FileSystem = fileSystem;
    for (const dir of currentPath) {
      const node = current[dir];
      if (node?.type === "directory" && node.children) {
        current = node.children;
      } else if (dir === currentPath[0]) {
        current = current[dir]?.children || current;
      }
    }
    return current;
  }, [currentPath]);

  const addLine = useCallback((type: TerminalLine["type"], content: string, prompt?: string) => {
    setLines((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), type, content, prompt },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Typing game functions
  const startTypingGame = useCallback(() => {
    const prompt = TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)];
    setTypingPrompt(prompt);
    setTypingGameActive(true);
    setTypingStartTime(null);
    setTypingRound((prev) => prev + 1);
    setCurrentInput("");
    addLine("system", `
╔════════════════════════════════════════════════════╗
║  🎮 HACKTYPE - Hacker Typing Challenge            ║
╠════════════════════════════════════════════════════╣
║  Type the code below as fast as you can!          ║
║  Press ESC to exit the game.                      ║
╚════════════════════════════════════════════════════╝

  ▶ ${prompt}
`);
  }, [addLine]);

  const endTypingGame = useCallback((completed: boolean = false) => {
    if (completed && typingStartTime && typingPrompt) {
      const elapsedSeconds = (Date.now() - typingStartTime) / 1000;
      const wordsTyped = typingPrompt.length / 5; // Standard: 5 chars = 1 word
      const wpm = Math.round((wordsTyped / elapsedSeconds) * 60);
      const newScore = typingScore + wpm;
      setTypingScore(newScore);
      
      if (wpm > typingHighScore) {
        setTypingHighScore(wpm);
      }

      addLine("success", `
✅ Perfect! Round ${typingRound} complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️  Time: ${elapsedSeconds.toFixed(2)}s
  ⚡ Speed: ${wpm} WPM
  🏆 High Score: ${Math.max(wpm, typingHighScore)} WPM
  📊 Total Score: ${newScore}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Press ENTER to continue or type 'exit' to quit.
`);
    } else {
      addLine("system", `
Game ended. Final score: ${typingScore} points over ${typingRound} rounds.
Type 'hacktype' to play again!`);
      setTypingRound(0);
      setTypingScore(0);
    }
    setTypingGameActive(false);
    setTypingPrompt("");
    setTypingStartTime(null);
    setCurrentInput("");
  }, [typingStartTime, typingPrompt, typingScore, typingRound, typingHighScore, addLine]);

  const executeCommand = useCallback((cmd: string) => {
    const args = cmd.trim().split(/\s+/);
    const command = args[0]?.toLowerCase();
    const params = args.slice(1);

    addLine("input", cmd, getPrompt());

    if (!command) return;

    switch (command) {
      case "help":
        addLine("output", `
Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ls              List directory contents
  cd <dir>        Change directory
  cat <file>      Display file contents
  pwd             Print working directory
  clear           Clear terminal
  whoami          Display user info
  goto <section>  Navigate to section
  open <url>      Open external link
  download resume Download resume PDF
  theme <dark|light> Switch theme
  matrix          Toggle Matrix rain effect
  hacktype        🎮 Start typing game!
  exit            Close terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case "ls":
        const dir = getCurrentDirectory();
        if (dir) {
          const contents = Object.entries(dir)
            .map(([name, node]) => {
              if (node.type === "directory") {
                return `📁 ${name}/`;
              }
              return `📄 ${name}`;
            })
            .join("\n");
          addLine("output", contents || "Empty directory");
        }
        break;

      case "cd":
        if (!params[0] || params[0] === "~") {
          setCurrentPath(["home"]);
        } else if (params[0] === "..") {
          if (currentPath.length > 1) {
            setCurrentPath((prev) => prev.slice(0, -1));
          }
        } else {
          const dir = getCurrentDirectory();
          if (dir && dir[params[0]]?.type === "directory") {
            setCurrentPath((prev) => [...prev, params[0]]);
          } else {
            addLine("error", `cd: no such directory: ${params[0]}`);
          }
        }
        break;

      case "cat":
        if (!params[0]) {
          addLine("error", "cat: missing file operand");
        } else {
          const dir = getCurrentDirectory();
          const file = dir?.[params[0]];
          if (file?.type === "file" && file.content) {
            addLine("output", file.content);
          } else {
            addLine("error", `cat: ${params[0]}: No such file`);
          }
        }
        break;

      case "pwd":
        addLine("output", `/${currentPath.join("/")}`);
        break;

      case "clear":
        setLines([]);
        break;

      case "whoami":
        addLine("output", `
╔═══════════════════════════════════════╗
║  JN Gonzales                          ║
║  Full Stack Engineer                  ║
║  Harvard CS50x Certified              ║
╠═══════════════════════════════════════╣
║  🌐 Next.js / React / TypeScript      ║
║  🐍 Python / FastAPI / Node           ║
║  🗄️  PostgreSQL / Redis               ║
║  ☁️  Vercel / AWS / Docker            ║
╚═══════════════════════════════════════╝`);
        break;

      case "goto":
        const sections: Record<string, string> = {
          home: "/",
          about: "/#about",
          projects: "/#projects",
          contact: "/#contact",
          blog: "/blog",
        };
        if (params[0] && sections[params[0]]) {
          addLine("system", `Navigating to ${params[0]}...`);
          setTimeout(() => {
            if (params[0] === "home") {
              router.push("/");
            } else if (sections[params[0]].startsWith("/#")) {
              document.getElementById(params[0])?.scrollIntoView({ behavior: "smooth" });
            } else {
              router.push(sections[params[0]]);
            }
          }, 500);
        } else {
          addLine("error", `goto: unknown section. Available: ${Object.keys(sections).join(", ")}`);
        }
        break;

      case "open":
        const links: Record<string, string> = {
          github: "https://github.com/jngonzales",
          linkedin: "https://linkedin.com/in/jn-gonzales",
          twitter: "https://twitter.com/jngonzales",
        };
        if (params[0] && links[params[0]]) {
          addLine("system", `Opening ${params[0]}...`);
          window.open(links[params[0]], "_blank");
        } else {
          addLine("error", `open: unknown link. Available: ${Object.keys(links).join(", ")}`);
        }
        break;

      case "download":
        if (params[0] === "resume") {
          addLine("system", "Downloading resume...");
          const link = document.createElement("a");
          link.href = "/resume.pdf";
          link.download = "JN_Gonzales_Resume.pdf";
          link.click();
        } else {
          addLine("error", "download: try 'download resume'");
        }
        break;

      case "theme":
        if (params[0] === "dark" || params[0] === "light") {
          addLine("system", `Switching to ${params[0]} mode...`);
          document.documentElement.classList.toggle("dark", params[0] === "dark");
        } else {
          addLine("error", "theme: use 'theme dark' or 'theme light'");
        }
        break;

      case "matrix":
        addLine("system", "Toggling Matrix rain effect...");
        window.dispatchEvent(new CustomEvent("toggleMatrix"));
        break;

      case "exit":
        addLine("system", "Goodbye! 👋");
        setTimeout(onClose, 500);
        break;

      case "sudo":
        addLine("output", `
🔐 Nice try! But you don't need sudo here.
   You're already in God Mode! 😎`);
        break;

      case "rm":
        if (params.includes("-rf") && params.includes("/")) {
          addLine("error", "Nice try! 😏 But this terminal is read-only.");
        } else {
          addLine("error", "rm: operation not permitted (read-only filesystem)");
        }
        break;

      case "hacktype":
        startTypingGame();
        break;

      default:
        addLine("error", `${command}: command not found. Type 'help' for available commands.`);
    }

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  }, [addLine, currentPath, getCurrentDirectory, getPrompt, onClose, router, startTypingGame]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle typing game mode
    if (typingGameActive) {
      if (e.key === "Escape") {
        e.preventDefault();
        endTypingGame(false);
        return;
      }
      return; // Let the input handle the rest
    }

    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion
      const dir = getCurrentDirectory();
      if (dir) {
        const matches = Object.keys(dir).filter((name) =>
          name.toLowerCase().startsWith(currentInput.split(/\s+/).pop()?.toLowerCase() || "")
        );
        if (matches.length === 1) {
          const parts = currentInput.split(/\s+/);
          parts[parts.length - 1] = matches[0];
          setCurrentInput(parts.join(" "));
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed z-100 ${
            isMaximized
              ? "inset-4"
              : "bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[600px] h-[400px] md:h-[450px]"
          }`}
        >
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl h-full flex flex-col font-mono">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors"
                  />
                </div>
                <TerminalIcon className="w-4 h-4 text-[#8b949e] ml-2" />
                <span className="text-[#8b949e] text-sm">God Mode Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-[#8b949e] hover:text-white transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              data-lenis-prevent
              className={`flex-1 overflow-y-auto p-4 text-sm min-h-0 terminal-scrollbar smooth-inner-scroll`}
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line) => (
                <div key={line.id} className="mb-1">
                  {line.type === "ascii" && (
                    <pre className="text-[#58a6ff] text-[8px] md:text-[10px] leading-tight whitespace-pre">
                      {line.content}
                    </pre>
                  )}
                  {line.type === "system" && (
                    <span className="text-[#8b949e]">💡 {line.content}</span>
                  )}
                  {line.type === "input" && (
                    <div>
                      <span className="text-[#58a6ff]">{line.prompt}</span>{" "}
                      <span className="text-[#c9d1d9]">{line.content}</span>
                    </div>
                  )}
                  {line.type === "output" && (
                    <pre className="text-[#c9d1d9] whitespace-pre-wrap">{line.content}</pre>
                  )}
                  {line.type === "error" && (
                    <span className="text-[#f85149]">❌ {line.content}</span>
                  )}
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center">
                <span className="text-[#58a6ff]">
                  {typingGameActive ? "⌨️ >" : getPrompt()}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentInput(value);
                    
                    // Handle typing game
                    if (typingGameActive && typingPrompt) {
                      // Start timer on first keystroke
                      if (!typingStartTime && value.length === 1) {
                        setTypingStartTime(Date.now());
                      }
                      
                      // Check if completed
                      if (value === typingPrompt) {
                        endTypingGame(true);
                        // Auto-start next round after short delay
                        setTimeout(() => startTypingGame(), 1500);
                      }
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-[#c9d1d9] ml-2 caret-[#58a6ff]"
                  autoFocus
                  spellCheck={false}
                />
              </div>
              
              {/* Typing Game Live Preview */}
              {typingGameActive && typingPrompt && (
                <div className="mt-2 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
                  <div className="font-mono text-sm">
                    {typingPrompt.split("").map((char, idx) => {
                      const typedChar = currentInput[idx];
                      let colorClass = "text-[#484f58]"; // Not typed yet (dim)
                      if (typedChar !== undefined) {
                        colorClass = typedChar === char ? "text-[#3fb950]" : "text-[#f85149] bg-[#f8514922]";
                      }
                      return (
                        <span key={idx} className={colorClass}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-xs text-[#8b949e] flex justify-between">
                    <span>Round: {typingRound}</span>
                    <span>Score: {typingScore}</span>
                    <span>High Score: {typingHighScore} WPM</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
