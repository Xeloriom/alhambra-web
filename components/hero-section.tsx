"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";

export function HeroSection({ data, onUpdate, isEditing }: { data?: any, onUpdate?: (path: string, value: any) => void, isEditing?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Geometry: Glass Blob
    const geometry = new THREE.IcosahedronGeometry(1.5, 64);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 1,
      thickness: 0.5,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 4;

    // Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.005;
      blob.rotation.x = time * 0.15;
      blob.rotation.y = time * 0.2;
      
      const position = blob.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        const noise = Math.sin(x * 1.5 + time) * 0.08 + Math.cos(y * 1.5 + time) * 0.08;
        position.setZ(i, 1.5 + noise);
      }
      position.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // GSAP Reveal Title
    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll(".word-inner");
      gsap.fromTo(words, 
        { y: "150%", rotate: 5, opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, duration: 1.8, stagger: 0.1, ease: "expo.out", delay: 0.5 }
      );
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-80 pointer-events-none" />
      <div className="grain-overlay" />
      
      <div className="relative z-10 text-center px-6">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="label-mono mb-8 block"
        >
          {data?.tagline || "Innovation & Design — 2026"}
        </motion.span>
        
        <h1 ref={titleRef} className="text-[clamp(60px,12vw,180px)] mb-12 flex flex-col items-center">
          <span className="split-line">
            <span className="word-inner inline-block">
              {data?.title_top || "L'Excellence"}
            </span>
          </span>
          <span className="split-line">
            <span className="word-inner inline-block italic">
              {data?.title_bottom || "Digitale."}
            </span>
          </span>
        </h1>

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
          className="w-32 h-[1px] bg-black mx-auto mb-16 origin-center"
        />

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <Link href="#work" className="group flex items-center gap-4 text-[13px] font-bold tracking-widest uppercase overflow-hidden">
            <span className="relative">
              {data?.cta_work || "Explore Works"}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
          <Link href="#contact" className="label-mono text-[11px] hover:opacity-50 transition-opacity">
            {data?.cta_contact || "Get in touch"}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="label-mono text-[8px]">Scroll to dive</span>
        <div className="w-[1px] h-12 bg-black/10 relative overflow-hidden">
          <motion.div animate={{ y: [0, 48] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-0 left-0 w-full h-1/2 bg-black" />
        </div>
      </div>
    </section>
  );
}
