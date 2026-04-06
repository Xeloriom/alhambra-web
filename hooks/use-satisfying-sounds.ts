'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';

let clickSynth: Tone.Synth | null = null;
let hoverSynth: Tone.MembraneSynth | null = null;
// IMPORTANT : On garde une trace du "prochain créneau disponible"
let nextAvailableTime = 0;

export function useSatisfyingSounds() {

  const init = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!clickSynth) {
      clickSynth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
      }).toDestination();
      clickSynth.volume.value = -12;
    }

    if (!hoverSynth) {
      hoverSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 }
      }).toDestination();
      hoverSynth.volume.value = -25;
    }
  }, []);

  const playClick = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (Tone.getContext().state !== 'running') await Tone.start();
    init();

    const now = Tone.now();
    // On s'assure que le clic passe TOUJOURS après le dernier son programmé
    const time = Math.max(now, nextAvailableTime + 0.02);
    nextAvailableTime = time;

    hoverSynth?.triggerRelease(time);
    clickSynth?.triggerAttackRelease("G6", "32n", time);
  }, [init]);

  const playHover = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (Tone.getContext().state !== 'running') await Tone.start();
    init();

    const now = Tone.now();

    // LA SOLUTION RADICALE :
    // Si 'now' est égal ou inférieur au dernier temps utilisé,
    // on ajoute 0.05s (50ms) pour forcer un temps strictement supérieur.
    const time = Math.max(now + 0.01, nextAvailableTime + 0.05);
    nextAvailableTime = time;

    hoverSynth?.triggerAttackRelease("C3", "16n", time);
  }, [init]);

  return { playClick, playHover };
}