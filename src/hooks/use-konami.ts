"use client";

import { useEffect, useState, useCallback } from "react";

// Konami Code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useKonamiCode(callback: () => void) {
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setInputSequence((prev) => {
      const next = [...prev, e.code];
      
      // Keep only the last N keys (length of Konami code)
      if (next.length > KONAMI_CODE.length) {
        next.shift();
      }
      
      // Check if sequence matches
      if (next.length === KONAMI_CODE.length) {
        const isMatch = next.every((key, i) => key === KONAMI_CODE[i]);
        if (isMatch) {
          callback();
          return []; // Reset sequence
        }
      }
      
      return next;
    });
  }, [callback]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return inputSequence.length; // Return progress for potential UI feedback
}
