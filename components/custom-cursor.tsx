"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
      });

      const target = e.target as HTMLElement;
      const isOverClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button';
      
      setIsHovering(!!isOverClickable);
    };

    const onMouseDown = () => gsap.to(cursor, { scale: 0.8, duration: 0.3 });
    const onMouseUp = () => gsap.to(cursor, { scale: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference rounded-full bg-white transition-all duration-300 ${
        isHovering ? "w-12 h-12" : "w-4 h-4"
      }`}
    />
  );
}
