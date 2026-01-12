"use client";

import { useCallback, useRef } from "react";

// Audio file URLs (using free sound effects)
const SOUNDS = {
  hover: "/sounds/hover.mp3",
  click: "/sounds/click.mp3",
  type: "/sounds/type.mp3",
  powerUp: "/sounds/powerup.mp3",
  success: "/sounds/success.mp3",
} as const;

type SoundName = keyof typeof SOUNDS;

// Singleton audio context and mute state
let audioContext: AudioContext | null = null;
let isMuted = false;

export function useSound() {
  const audioCache = useRef<Map<SoundName, AudioBuffer>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
  }, []);

  const loadSound = useCallback(async (name: SoundName): Promise<AudioBuffer | null> => {
    if (audioCache.current.has(name)) {
      return audioCache.current.get(name)!;
    }

    try {
      const response = await fetch(SOUNDS[name]);
      const arrayBuffer = await response.arrayBuffer();
      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioCache.current.set(name, audioBuffer);
      return audioBuffer;
    } catch {
      // Sound file not found or error loading - fail silently
      return null;
    }
  }, [getAudioContext]);

  const play = useCallback(async (name: SoundName, volume = 0.3) => {
    if (isMuted) return;

    try {
      const buffer = await loadSound(name);
      if (!buffer) return;

      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
    } catch {
      // Fail silently if audio can't play
    }
  }, [getAudioContext, loadSound]);

  const toggleMute = useCallback(() => {
    isMuted = !isMuted;
    return isMuted;
  }, []);

  const getMuted = useCallback(() => isMuted, []);

  return { play, toggleMute, getMuted };
}

// Export mute state setter for external use
export function setGlobalMute(muted: boolean) {
  isMuted = muted;
}

export function getGlobalMute() {
  return isMuted;
}
