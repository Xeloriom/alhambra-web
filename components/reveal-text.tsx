"use client";

import { useRef, useEffect, useState } from "react";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLElement & HTMLHeadingElement>} className={`${className}`} aria-label={children}>
      <span className="flex flex-wrap gap-x-[0.25em] whitespace-normal">
        {words.map((word, i) => (
          <span
            key={i}
            className="overflow-hidden inline-block"
            aria-hidden="true"
          >
            <span
              className="inline-block"
              style={{
                transform: visible ? "translateY(0)" : "translateY(110%)",
                opacity: visible ? 1 : 0,
                transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.07}s, opacity 0.5s ease ${delay + i * 0.07}s`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className = "", delay = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} whitespace-normal`}
      style={{
        transform: visible ? "translateY(0)" : "translateY(50px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
