"use client";

import { useEffect, useRef, useCallback } from "react";

export function FloatingElements() {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>();
  const scrollY = useRef(0);

  const animate = useCallback(() => {
    elementsRef.current.forEach((el, index) => {
      if (!el) return;
      const speed = (index + 1) * 0.03;
      const rotation = scrollY.current * speed * 0.08;
      const yOffset = scrollY.current * speed;
      el.style.transform = `translate3d(0, ${yOffset}px, 0) rotate(${rotation}deg)`;
    });
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    elementsRef.current[index] = el;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        ref={setRef(0)}
        className="absolute top-[15%] right-[10%] w-3 h-3 bg-[#FF4D00] rounded-full opacity-30"
        style={{ willChange: "transform" }}
      />
      <div
        ref={setRef(1)}
        className="absolute top-[35%] left-[5%] w-2 h-2 bg-[#FF4D00] opacity-20"
        style={{ willChange: "transform" }}
      />
      <div
        ref={setRef(2)}
        className="absolute top-[55%] right-[15%] w-4 h-4 border border-[#FF4D00] rounded-full opacity-15"
        style={{ willChange: "transform" }}
      />
      <div
        ref={setRef(3)}
        className="absolute top-[75%] left-[12%] w-2 h-6 bg-[#FF4D00] opacity-10"
        style={{ willChange: "transform" }}
      />
      <div
        ref={setRef(4)}
        className="absolute top-[25%] left-[20%] w-5 h-5 border border-black/5 rotate-45"
        style={{ willChange: "transform" }}
      />
      <div
        ref={setRef(5)}
        className="absolute top-[85%] right-[25%] w-1 h-1 bg-black/10 rounded-full"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
