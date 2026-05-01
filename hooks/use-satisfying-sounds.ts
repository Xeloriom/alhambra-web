'use client';

import { useCallback, useRef } from 'react';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
        if (!ctx) {
            ctx = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        }
        return ctx;
    } catch {
        return null;
    }
}

function scheduleBlip(ac: AudioContext, frequency: number, volumeDb: number, durationMs: number) {
    const now  = ac.currentTime;
    const gain = ac.createGain();
    const osc  = ac.createOscillator();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, now + durationMs / 1000);

    const vol = Math.pow(10, volumeDb / 20);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.01);
}

// Always awaits resume before scheduling — fixes "sometimes silent" bug
async function playBlip(frequency: number, volumeDb: number, durationMs: number) {
    const ac = getCtx();
    if (!ac) return;
    try {
        if (ac.state !== 'running') await ac.resume();
    } catch {
        return;
    }
    scheduleBlip(ac, frequency, volumeDb, durationMs);
}

export function useSatisfyingSounds() {
    const lastClick = useRef(0);
    const lastHover = useRef(0);

    const playClick = useCallback(() => {
        const now = Date.now();
        if (now - lastClick.current < 80) return;
        lastClick.current = now;
        playBlip(900, -18, 90);
    }, []);

    const playHover = useCallback(() => {
        const now = Date.now();
        if (now - lastHover.current < 120) return;
        lastHover.current = now;
        playBlip(1100, -28, 45);
    }, []);

    return { playClick, playHover };
}
