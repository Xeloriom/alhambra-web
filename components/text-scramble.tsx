"use client";

import { useEffect, useState, useRef } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
}

export function TextScramble({
  text,
  className = "",
  scrambleOnHover = true,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration / 3) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration++;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (scrambleOnHover) {
    return (
      <span className={className} onMouseEnter={scramble}>
        {displayText}
      </span>
    );
  }

  return <span className={className}>{displayText}</span>;
}
