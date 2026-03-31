"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    const target = e.target as HTMLElement;
    const interactive = !!target.closest('a, button, [data-cursor-hover], [role="button"]');
    setIsHovering(interactive);
  }, [isVisible, mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", () => setIsVisible(false));
    document.addEventListener("mouseenter", () => setIsVisible(true));
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", () => setIsVisible(false));
      document.removeEventListener("mouseenter", () => setIsVisible(true));
    };
  }, [handleMouseMove]);

  return (
    <motion.div 
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <motion.div
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        className="absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Inner Dot */}
        <motion.div 
          animate={{ scale: isHovering ? 0 : 1 }}
          className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"
        />
        
        {/* Outer Ring */}
        <motion.div 
          animate={{ 
            width: isHovering ? 100 : 40, 
            height: isHovering ? 100 : 40,
            backgroundColor: isHovering ? "rgba(201, 168, 76, 0.15)" : "rgba(255, 255, 255, 0)"
          }}
          className="absolute rounded-full border border-[#C9A84C]/50 flex items-center justify-center backdrop-blur-[2px]"
        >
           {isHovering && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[#C9A84C]"
             >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
               </svg>
             </motion.div>
           )}
        </motion.div>
      </motion.div>
      
      <style jsx global>{`
        html, body, a, button, [role="button"], input, textarea {
          cursor: none !important;
        }
      `}</style>
    </motion.div>
  );
}
