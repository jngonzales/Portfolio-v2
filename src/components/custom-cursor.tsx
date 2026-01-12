"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const trailIdRef = useRef(0);

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible && isMountedRef.current) setIsVisible(true);
      
      // Add trail dot
      const newDot = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setTrail(prev => [...prev.slice(-8), newDot]); // Keep last 8 dots
    },
    [cursorX, cursorY, isVisible]
  );

  // Clean up old trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Add class to html for global cursor hiding
    document.documentElement.classList.add("has-custom-cursor");

    const handleMouseMove = (e: MouseEvent) => moveCursor(e);

    const handleMouseEnter = () => {
      if (isMountedRef.current) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      if (isMountedRef.current) {
        setIsVisible(false);
        setTrail([]);
      }
    };

    const handleMouseDown = () => {
      if (isMountedRef.current) setIsClicking(true);
    };

    const handleMouseUp = () => {
      if (isMountedRef.current) setIsClicking(false);
    };

    // Handle hover states
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (isMountedRef.current) setIsHovering(true);
        });
        el.addEventListener("mouseleave", () => {
          if (isMountedRef.current) setIsHovering(false);
        });
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    handleElementHover();

    // Re-run hover detection on DOM changes
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      isMountedRef.current = false;
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, [moveCursor]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Trail effect */}
      <AnimatePresence>
        {trail.map((dot, index) => (
          <motion.div
            key={dot.id}
            className="fixed pointer-events-none z-[9998]"
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              left: dot.x - 4,
              top: dot.y - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `rgba(168, 85, 247, ${0.3 + (index / trail.length) * 0.4})`,
              boxShadow: "0 0 6px rgba(168, 85, 247, 0.3)",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor arrow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.85 : isHovering ? 1.2 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {/* Custom arrow cursor */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: "translate(-2px, -2px)",
              filter: isHovering 
                ? "drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))" 
                : "drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))",
            }}
          >
            {/* Arrow shape */}
            <path
              d="M5.5 3.21V20.79c0 0.45 0.54 0.67 0.85 0.35l4.44-4.35h8.41c0.3 0 0.49-0.32 0.35-0.58l-13-15c-0.23-0.27-0.65-0.09-0.65 0.24z"
              fill={isHovering ? "#a855f7" : "#ffffff"}
              stroke={isHovering ? "#ffffff" : "#000000"}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Hide default cursor - stronger rules */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          *,
          *::before,
          *::after,
          html,
          body,
          a,
          button,
          input,
          textarea,
          select,
          [role="button"] {
            cursor: none !important;
          }
          
          /* Ensure text selection still works but hides cursor */
          ::selection {
            cursor: none !important;
          }
          
          /* Handle scrollbars */
          ::-webkit-scrollbar-thumb,
          ::-webkit-scrollbar-track {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
