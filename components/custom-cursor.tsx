"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    
    const x = e.clientX;
    const y = e.clientY;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    const target = e.target as HTMLElement;
    const interactive = !!target.closest('a, button, [data-cursor-hover], [role="button"]');
    const input = !!target.closest('input, textarea, [contenteditable="true"]');
    
    setIsHovering(interactive);
    setIsInput(input);
  }, [isVisible]);

  const handleMouseDown = useCallback(() => setIsClicked(true), []);
  const handleMouseUp = useCallback(() => setIsClicked(false), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-3 -mt-3 w-6 h-6 rounded-full border border-black/10 flex items-center justify-center will-change-transform pointer-events-none mix-blend-difference"
        style={{ 
          transition: "width 0.3s ease, height 0.3s ease, margin 0.3s ease, background-color 0.3s ease" 
        }}
      >
        <div className={`rounded-full bg-white transition-all duration-300 ${
          isClicked ? "w-2 h-2" : 
          isHovering ? "w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/50" : 
          isInput ? "w-1 h-6 rounded-sm" : "w-1.5 h-1.5"
        }`} />
        
        {isHovering && !isClicked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        html, body, a, button, [role="button"], input, textarea {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
