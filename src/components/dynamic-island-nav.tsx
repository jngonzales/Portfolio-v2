"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, User, Briefcase, Mail, Menu, X, BookOpen, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", href: "#" },
  { icon: <User className="w-5 h-5" />, label: "About", href: "#about" },
  { icon: <Briefcase className="w-5 h-5" />, label: "Projects", href: "#projects" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Blog", href: "/blog" },
  { icon: <Mail className="w-5 h-5" />, label: "Contact", href: "#contact" },
];

export function DynamicIslandNav({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  // Track scroll direction to show/hide
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? "down" : "up";
    setLastScrollY(latest);
    
    // Hide when scrolling down, show when scrolling up
    if (direction === "down" && latest > 100) {
      setIsVisible(false);
      setIsExpanded(false);
    } else {
      setIsVisible(true);
    }
  });

  // Track scroll progress
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || "home");
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ["about", "projects", "contact"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const router = useRouter();

  const handleNavClick = useCallback((href: string) => {
    setIsExpanded(false);
    
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [router]);

  // Haptic feedback (on supported devices)
  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
        >
          <motion.div
            layout
            className="relative bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-2xl overflow-hidden"
            animate={{
              width: isExpanded ? 320 : 160,
              height: isExpanded ? "auto" : 56,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-0.5 bg-primary"
              style={{ width: `${scrollProgress * 100}%` }}
            />

            {/* Collapsed state */}
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between px-4 h-14"
                >
                  {/* Active section indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium capitalize">{activeSection}</span>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setIsExpanded(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold">Navigation</span>
                    <button
                      onClick={() => {
                        triggerHaptic();
                        setIsExpanded(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-muted"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nav items */}
                  <div className="grid grid-cols-3 gap-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          triggerHaptic();
                          handleNavClick(item.href);
                        }}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                          activeSection === item.label.toLowerCase()
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {item.icon}
                        <span className="text-[10px] font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                    
                    {/* God Mode Terminal button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      onClick={() => {
                        triggerHaptic();
                        setIsExpanded(false);
                        onOpenTerminal();
                      }}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 transition-colors"
                    >
                      <Terminal className="w-5 h-5 text-green-500" />
                      <span className="text-[10px] font-medium text-green-500">Terminal</span>
                    </motion.button>
                  </div>

                  {/* Scroll progress */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${scrollProgress * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(scrollProgress * 100)}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
