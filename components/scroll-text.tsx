"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollTextProps {
  children: string;
  className?: string;
  speed?: number;
}

export function ScrollText({ children, className = "", speed = 0.5 }: ScrollTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (viewportCenter - elementCenter) * speed;
      setOffset(distance);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{ transform: `translateX(${offset}px)` }}
        className="whitespace-nowrap transition-transform duration-100 ease-out"
      >
        {children}
      </div>
    </div>
  );
}

interface ScrollRotateProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ScrollRotate({ children, className = "", speed = 0.1 }: ScrollRotateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollY = window.scrollY;
      setRotation(scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`transition-transform duration-100 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

interface ScrollScaleProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export function ScrollScale({ 
  children, 
  className = "", 
  minScale = 0.8, 
  maxScale = 1.2 
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      
      // Calculate progress: 0 when element enters viewport, 1 when at center
      const progress = Math.max(0, Math.min(1, 1 - elementTop / viewportHeight));
      const newScale = minScale + progress * (maxScale - minScale);
      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [minScale, maxScale]);

  return (
    <div
      ref={ref}
      style={{ transform: `scale(${scale})` }}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
