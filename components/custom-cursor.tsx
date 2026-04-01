"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Activer la classe CSS sur l'élément HTML pour masquer le curseur système
    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Utilisation de GSAP avec un easing "force" pour éviter le retard perceptible (buggy mouse)
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25, // Un peu plus rapide pour la réactivité
        ease: "power2.out"
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
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isVisible]);

  return (
    <div 
      ref={cursorRef} 
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 flex items-center justify-center transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${
        isHovering ? "w-16 h-16 bg-black text-white text-[10px] font-bold" : "w-4 h-4 bg-transparent"
      }`} 
    >
      {isHovering && <span>VIEW</span>}
      {!isHovering && <div className="w-1 h-1 bg-black rounded-full" />}
    </div>
  );
}
