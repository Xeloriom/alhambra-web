"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isOverClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[data-cursor="hover"]') ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button';
      
      setIsHovering(!!isOverClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-[#C9A84C] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      
      {/* Follower Circle */}
      <div 
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-[0.12s] ease-out hidden md:block border-2 ${
          isHovering 
            ? 'w-16 h-16 border-[#C9A84C] mix-blend-difference bg-[#C9A84C]/10' 
            : 'w-10 h-10 border-[#C9A84C]/60'
        }`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
    </>
  );
}
