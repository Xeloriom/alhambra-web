"use client";

import React, { useEffect, useRef, useCallback } from "react";

export function FloatingElements() {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>(0);
  const scrollY = useRef(0);

  const animate = useCallback(() => {
    scrollY.current += (window.scrollY - scrollY.current) * 0.1;

    elementsRef.current.forEach((el, i) => {
      if (!el) return;
      const speed = (i + 1) * 0.1;
      const y = scrollY.current * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={(el) => { elementsRef.current[i] = el; }}
          className="absolute rounded-full border border-white/10"
          style={{
            width: `${(i + 1) * 100}px`,
            height: `${(i + 1) * 100}px`,
            left: `${(i * 20)}%`,
            top: `${(i * 15)}%`,
          }}
        />
      ))}
    </div>
  );
}
