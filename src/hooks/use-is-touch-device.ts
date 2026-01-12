"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch capability
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is not in standard types
        navigator.msMaxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    checkTouchDevice();

    // Also listen for media query changes (e.g., device rotation)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handleChange = () => checkTouchDevice();
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isTouchDevice;
}
