"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Fast at first, slow at end
        const increment = prev < 70 ? Math.random() * 15 + 5 : Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }, 300);
    }
  }, [progress]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000] transition-all duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo / Brand */}
      <div
        className={`mb-12 overflow-hidden transition-all duration-500 ${
          isExiting ? "translate-y-[-20px] opacity-0" : ""
        }`}
      >
        <h1
          className="text-5xl md:text-7xl font-black text-white tracking-tighter"
          style={{
            animation: "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          FORGE
          <span className="text-[#FF4D00]">.</span>
        </h1>
      </div>

      {/* Progress bar container */}
      <div
        className={`w-64 md:w-80 transition-all duration-500 ${
          isExiting ? "translate-y-[20px] opacity-0" : ""
        }`}
      >
        {/* Progress number */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Loading
          </span>
          <span className="text-white font-mono text-sm">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF4D00] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 text-white/20 text-xs tracking-widest">
        DIGITAL AGENCY
      </div>
      <div className="absolute bottom-8 right-8 text-white/20 text-xs tracking-widest">
        EST. 2024
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-[#FF4D00]/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-[#FF4D00]/30" />
      <div className="absolute bottom-20 left-8 w-8 h-8 border-l-2 border-b-2 border-[#FF4D00]/30" />
      <div className="absolute bottom-20 right-8 w-8 h-8 border-r-2 border-b-2 border-[#FF4D00]/30" />
    </div>
  );
}
