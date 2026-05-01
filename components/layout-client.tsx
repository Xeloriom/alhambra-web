'use client';

import { useState, ReactNode, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HeroReadyContext } from '@/components/hero-ready-context';

// Lazy-load preloader — not needed for LCP
const Preloader = dynamic(() => import('@/components/ui/preloader'), {
  ssr: false,
});

export default function LayoutClient({ children }: { children: ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);

  // useCallback prevents child re-renders from Preloader
  const handleLoaderComplete = useCallback(() => setHeroReady(true), []);

  return (
      <HeroReadyContext.Provider value={heroReady}>
        <Preloader onComplete={handleLoaderComplete} />
        {children}
      </HeroReadyContext.Provider>
  );
}