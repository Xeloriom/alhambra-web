"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Manifeste() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const words = textRef.current.querySelectorAll("span");
    
    gsap.to(words, {
      color: "#1d1d1f",
      stagger: 0.1,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        end: "bottom 30%",
        scrub: true,
      }
    });
  }, []);

  const content = "Nous ne construisons pas seulement des interfaces. Nous sculptons des émotions numériques. ALHAMBRAWeb fusionne l'ingénierie de précision avec une esthétique intemporelle pour redéfinir votre futur.";

  return (
    <section className="bg-white py-64 px-6 flex justify-center border-y border-gray-100">
      <div className="max-w-4xl text-center">
        <span className="label-mono mb-12 block">Notre Vision</span>
        <div ref={textRef} className="reading-text text-[clamp(32px,5vw,64px)] font-serif font-medium leading-[1.1] text-[#e2e2e7] tracking-tight">
          {content.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
