'use client';

import { useCallback } from 'react';

export function useSatisfyingSounds() {
  const playSound = useCallback((frequency: number, type: OscillatorType, duration: number, volume: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
      
      // Fermer le contexte après la lecture pour économiser les ressources
      setTimeout(() => audioCtx.close(), duration * 1000 + 100);
    } catch (e) {
      console.warn("Audio not supported or blocked", e);
    }
  }, []);

  const playClick = useCallback(() => {
    // Un petit clic sec et haut
    playSound(800, 'sine', 0.1, 0.1);
  }, [playSound]);

  const playHover = useCallback(() => {
    // Un petit "pop" très discret et grave
    playSound(400, 'sine', 0.05, 0.05);
  }, [playSound]);

  const playSuccess = useCallback(() => {
    // Une petite montée de notes
    playSound(600, 'sine', 0.1, 0.1);
    setTimeout(() => playSound(800, 'sine', 0.1, 0.1), 100);
  }, [playSound]);

  return {
    playClick,
    playHover,
    playSuccess
  };
}
