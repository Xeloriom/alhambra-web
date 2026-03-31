"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[1001] h-[3px] bg-transparent">
      <div
        className="h-full bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.5)] transition-all duration-75 origin-left"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
