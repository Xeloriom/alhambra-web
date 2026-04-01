"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { WorksSection } from "@/components/works-section";
import { Manifeste } from "@/components/manifeste";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
    const cursorDot = useRef<HTMLDivElement>(null);
    const cursorRing = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Custom cursor
        const dot = cursorDot.current;
        const ring = cursorRing.current;
        let ringX = 0, ringY = 0;
        let mouseX = 0, mouseY = 0;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dot) {
                dot.style.left = `${e.clientX}px`;
                dot.style.top = `${e.clientY}px`;
            }
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            if (ring) {
                ring.style.left = `${ringX}px`;
                ring.style.top = `${ringY}px`;
            }
            requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener("mousemove", onMove);
        return () => {
            window.removeEventListener("mousemove", onMove);
            lenis.destroy();
        };
    }, []);

    return (
        <>
            {/* Custom Cursor */}
            <div ref={cursorDot} className="cursor-dot" />
            <div ref={cursorRing} className="cursor-ring" />

            <main className="relative bg-white min-h-screen overflow-hidden gpu">
                <Navbar />
                <HeroSection />
                <ServicesSection />
                <WorksSection />
                <Manifeste />
                <ContactSection />
                <Footer />
            </main>
        </>
    );
}