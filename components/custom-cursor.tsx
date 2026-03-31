"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    // Direct DOM manipulation for zero-lag position
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    if (ringRef.current) {
      // The ring can have a very slight delay for a "fluid" feel, 
      // but the main dot must be instant.
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    const target = e.target as HTMLElement;
    const interactive = !!target.closest('a, button, [data-cursor-hover], [role="button"]');
    const input = !!target.closest('input, textarea, [contenteditable="true"]');
    
    setIsHovering(interactive);
    setIsInput(input);
  }, []);

  const handleMouseDown = useCallback(() => setIsClicked(true), []);
  const handleMouseUp = useCallback(() => setIsClicked(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Main Cursor Dot - Instant Tracking */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-2 -mt-2 w-4 h-4 rounded-full bg-[#FF4D00] flex items-center justify-center will-change-transform pointer-events-none"
        style={{ transition: "scale 0.25s ease-out, background-color 0.2s ease-in" }}
      >
        <div className={`transition-all duration-300 ${isClicked ? "scale-75" : isHovering ? "scale-[2.5]" : isInput ? "scale-50" : "scale-100"}`}>
           {isHovering && !isClicked && (
            <span className="text-[3px] font-black text-white uppercase tracking-tighter opacity-100">
              Plus
            </span>
          )}
        </div>
      </div>
      
      {/* Outer subtle ring - Fluid Tracking */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 border border-[#FF4D00] rounded-full will-change-transform pointer-events-none"
        style={{ 
          transition: "transform 0.08s ease-out, opacity 0.3s ease, scale 0.3s ease" 
        }}
      >
        <div className={`w-full h-full rounded-full border border-[#FF4D00] transition-all duration-300 ${isHovering ? "scale-0 opacity-0" : "scale-100 opacity-30"}`} />
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        /* Restore cursor for inputs if needed for accessibility, 
           but usually hidden for custom cursor designs */
        input, textarea {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
