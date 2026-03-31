"use client";

import { useEffect, useRef, ReactNode } from "react";

interface MouseParallaxProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function MouseParallax({
  children,
  intensity = 20,
  className = "",
}: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      element.style.transform = `translate(${deltaX * intensity}px, ${deltaY * intensity}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0px, 0px)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
