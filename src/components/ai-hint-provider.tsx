"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";

interface HoverContext {
  projectId: number | null;
  projectTitle: string;
  hoverDuration: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface AIHintContextType {
  setHoveredProject: (id: number | null, title?: string) => void;
  showHint: boolean;
  hintMessage: string;
  dismissHint: () => void;
  triggerChat: () => void;
  mousePosition: MousePosition;
}

const AIHintContext = createContext<AIHintContextType | null>(null);

export const useAIHint = () => {
  const context = useContext(AIHintContext);
  return context;
};

const projectHints: Record<number, string[]> = {
  1: [ // DealFlow
    "Wondering how DealFlow handles real-time pipeline updates? Let's chat!",
    "The FastAPI backend in DealFlow uses some interesting patterns - ask me!",
    "Curious about the PostgreSQL schema design for DealFlow? I'd love to explain!",
  ],
  2: [ // Portfolio 2026
    "This portfolio has some cool tricks - ask me about the 3D effects!",
    "Want to know about the 'God Mode' terminal? Type the Konami code or ask me!",
    "The AI chatbot you're about to use is powered by Gemini - curious how?",
  ],
  3: [ // LinkHub
    "Curious how I built LinkHub's real-time link analytics? Ask me!",
    "Want to know about Supabase Row-Level Security implementation? I can explain!",
    "The QR code generation in LinkHub is pretty cool - ask me how it works!",
  ],
};

export function AIHintProvider({ children, onOpenChat }: { children: React.ReactNode; onOpenChat: () => void }) {
  const [hoverContext, setHoverContext] = useState<HoverContext>({
    projectId: null,
    projectTitle: "",
    hoverDuration: 0,
  });
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const [dismissedProjects, setDismissedProjects] = useState<Set<number>>(new Set());
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [hintPosition, setHintPosition] = useState<MousePosition>({ x: 0, y: 0 }); // Locked position when hint shows
  
  // Use ref to track current project ID for timer validation
  const currentProjectIdRef = useRef<number | null>(null);
  // Use ref for mouse position to avoid stale closure in timer
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });

  // Track mouse position when hovering on projects (only before hint appears)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse before the hint is shown
      if (hoverContext.projectId !== null && !showHint) {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoverContext.projectId, showHint]);

  const setHoveredProject = useCallback((id: number | null, title?: string) => {
    // Clear any existing timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }

    if (id === null) {
      currentProjectIdRef.current = null;
      setHoverContext({ projectId: null, projectTitle: "", hoverDuration: 0 });
      // Also hide the hint when mouse leaves the project
      setShowHint(false);
      return;
    }

    // Don't show hint if user already dismissed for this project
    if (dismissedProjects.has(id)) {
      return;
    }

    // Update the ref immediately so we can validate in the timer
    currentProjectIdRef.current = id;
    setHoverContext({ projectId: id, projectTitle: title || "", hoverDuration: 0 });

    // Start a timer - show hint after 2 seconds of hovering
    const timer = setTimeout(() => {
      // Only show hint if we're still hovering on the same project
      if (currentProjectIdRef.current === id && projectHints[id]) {
        const hints = projectHints[id];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        setHintMessage(randomHint);
        // Lock the position where the hint will appear
        setHintPosition({ x: mousePositionRef.current.x, y: mousePositionRef.current.y });
        setShowHint(true);
      }
    }, 2000);

    setHoverTimer(timer);
  }, [hoverTimer, dismissedProjects]);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    if (hoverContext.projectId) {
      setDismissedProjects((prev) => new Set(prev).add(hoverContext.projectId!));
    }
  }, [hoverContext.projectId]);

  const triggerChat = useCallback(() => {
    setShowHint(false);
    onOpenChat();
  }, [onOpenChat]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  return (
    <AIHintContext.Provider
      value={{
        setHoveredProject,
        showHint,
        hintMessage,
        dismissHint,
        triggerChat,
        mousePosition: hintPosition,
      }}
    >
      {children}
      <AIHintBubble />
    </AIHintContext.Provider>
  );
}

function AIHintBubble() {
  const context = useContext(AIHintContext);
  if (!context) return null;

  const { showHint, hintMessage, dismissHint, triggerChat, mousePosition } = context;

  // Calculate position - show hint to the right of cursor, with boundary checks
  const hintStyle = {
    left: Math.min(mousePosition.x + 20, typeof window !== 'undefined' ? window.innerWidth - 320 : mousePosition.x + 20),
    top: Math.max(mousePosition.y - 60, 20),
  };

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed z-50 max-w-xs pointer-events-auto"
          style={hintStyle}
        >
          <div className="relative">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-primary rotate-45" />
            
            {/* Main bubble */}
            <div className="relative bg-primary text-primary-foreground rounded-2xl p-4 shadow-2xl">
              {/* Close button */}
              <button
                onClick={dismissHint}
                className="absolute -top-2 -right-2 w-6 h-6 bg-background text-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Icon */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">{hintMessage}</p>
                  <button
                    onClick={triggerChat}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Ask Me
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
