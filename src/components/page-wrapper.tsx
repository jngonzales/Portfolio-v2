"use client";

import { useState, useSyncExternalStore, createContext, useContext, useEffect, useCallback } from "react";
import { Loader } from "@/components/loader";
import { MatrixRain } from "@/components/matrix-rain";
import { GodModeTerminal } from "@/components/god-mode-terminal";
import { DynamicIslandNav } from "@/components/dynamic-island-nav";
import { CommandPalette } from "@/components/command-palette";
import { useKonamiCode } from "@/hooks/use-konami";

// Context to allow other components to toggle Matrix mode and Harvard mode
interface UIContextType {
  matrixMode: boolean;
  toggleMatrixMode: () => void;
  harvardMode: boolean;
  toggleHarvardMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  godModeOpen: boolean;
  toggleGodMode: () => void;
}

export const UIContext = createContext<UIContextType>({
  matrixMode: false,
  toggleMatrixMode: () => {},
  harvardMode: false,
  toggleHarvardMode: () => {},
  soundEnabled: true,
  toggleSound: () => {},
  godModeOpen: false,
  toggleGodMode: () => {},
});

export const useUI = () => useContext(UIContext);

interface PageWrapperProps {
  children: React.ReactNode;
}

// Check sessionStorage for loader state
function getHasSeenLoader() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("portfolio-loader-seen") === "true";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Toast notification component
function HarvardToast({ show, onClose }: { show: boolean; onClose: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-200 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="bg-[#A51C30] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-[#C90016]">
        <span className="text-xl">🎓</span>
        <span className="font-semibold">Harvard Credentials Verified: God Mode Active</span>
      </div>
    </div>
  );
}

export function PageWrapper({ children }: PageWrapperProps) {
  const hasSeenLoader = useSyncExternalStore(subscribe, getHasSeenLoader, () => false);
  const [isLoading, setIsLoading] = useState(!hasSeenLoader);
  const [matrixMode, setMatrixMode] = useState(false);
  const [harvardMode, setHarvardMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [godModeOpen, setGodModeOpen] = useState(false);

  const handleComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("portfolio-loader-seen", "true");
  };

  const toggleMatrixMode = () => setMatrixMode(!matrixMode);
  const toggleGodMode = () => setGodModeOpen(!godModeOpen);
  const toggleHarvardMode = useCallback(() => {
    setHarvardMode(prev => !prev);
    setShowToast(true);
    
    // Trigger confetti if available
    if (typeof window !== "undefined" && !harvardMode) {
      import("canvas-confetti").then(confetti => {
        confetti.default({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.3 },
          colors: ["#A51C30", "#C90016", "#FFD700", "#FFFFFF"],
        });
      }).catch(() => {
        // canvas-confetti not installed, skip confetti
      });
    }
  }, [harvardMode]);
  
  const toggleSound = () => setSoundEnabled(!soundEnabled);

  // Konami Code Easter Egg
  useKonamiCode(toggleHarvardMode);

  // Listen for matrix toggle events (from God Mode Terminal)
  useEffect(() => {
    const handleToggleMatrix = () => toggleMatrixMode();
    window.addEventListener("toggleMatrix", handleToggleMatrix);
    return () => window.removeEventListener("toggleMatrix", handleToggleMatrix);
  });

  // Apply Harvard mode styles
  useEffect(() => {
    if (harvardMode) {
      document.documentElement.style.setProperty("--primary", "0 73% 41%"); // Crimson
      document.documentElement.style.setProperty("--accent", "45 100% 50%"); // Gold
    } else {
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--accent");
    }
  }, [harvardMode]);

  return (
    <UIContext.Provider value={{ matrixMode, toggleMatrixMode, harvardMode, toggleHarvardMode, soundEnabled, toggleSound, godModeOpen, toggleGodMode }}>
      {isLoading && <Loader onComplete={handleComplete} />}
      {matrixMode && <MatrixRain />}
      <HarvardToast show={showToast} onClose={() => setShowToast(false)} />
      
      {/* Command Palette - inside UIContext so it can access toggleMatrixMode */}
      <CommandPalette />
      
      {/* God Mode Terminal */}
      <GodModeTerminal isOpen={godModeOpen} onClose={() => setGodModeOpen(false)} />
      
      {/* Mobile Dynamic Island Navigation */}
      <DynamicIslandNav onOpenTerminal={toggleGodMode} />
      
      <div 
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
        className={harvardMode ? "harvard-mode" : ""}
      >
        {children}
      </div>
    </UIContext.Provider>
  );
}
