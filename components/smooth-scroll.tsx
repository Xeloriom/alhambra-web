'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

declare global {
  interface Window { __lenis?: Lenis; }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef   = useRef<number>(0);
  const pathname = usePathname();

  const isAdmin = pathname?.includes('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const init = () => {
      if (lenisRef.current) return;

      // Skip on mobile — native touch scrolling is smoother than Lenis
      if (window.innerWidth < 768) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
        lerp: 0.12,
        infinite: false,
        prevent: (node: Element) => node.hasAttribute('data-lenis-prevent'),
      });

      lenisRef.current = lenis;
      window.__lenis   = lenis;

      const handleAnchor = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
      };
      document.addEventListener('click', handleAnchor);

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);

      // Store cleanup on lenis instance for teardown
      (lenis as Lenis & { _cleanup?: () => void })._cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        document.removeEventListener('click', handleAnchor);
        lenis.destroy();
        lenisRef.current = null;
        delete window.__lenis;
      };
    };

    // Defer Lenis until after browser is idle — reduces TBT on initial load
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(init, { timeout: 1000 });
      return () => {
        cancelIdleCallback(id);
        const l = lenisRef.current as (Lenis & { _cleanup?: () => void }) | null;
        l?._cleanup?.();
      };
    } else {
      // Fallback: defer 200ms on browsers without requestIdleCallback (Safari < 15.4)
      const t = setTimeout(init, 200);
      return () => {
        clearTimeout(t);
        const l = lenisRef.current as (Lenis & { _cleanup?: () => void }) | null;
        l?._cleanup?.();
      };
    }
  }, [isAdmin]);

  return <>{children}</>;
}
