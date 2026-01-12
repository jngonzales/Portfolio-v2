"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      // Prevent Lenis from hijacking scroll inside elements with overflow
      prevent: (node: HTMLElement) => {
        // Allow native scroll in elements with overflow-y auto/scroll
        const style = window.getComputedStyle(node);
        const isScrollable = 
          style.overflowY === "auto" || 
          style.overflowY === "scroll" ||
          node.classList.contains("overflow-y-auto") ||
          node.classList.contains("overflow-auto");
        
        // Check if this element or any parent has data-lenis-prevent
        const hasPreventAttr = node.closest("[data-lenis-prevent]") !== null;
        
        return isScrollable || hasPreventAttr;
      },
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
