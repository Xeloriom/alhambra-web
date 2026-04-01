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

    // --- THREE.JS SCENE CONFIG (FROSTED GLASS EFFECT) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Geometry: A more sophisticated "Frosted Glass Sphere" like the Dribbble ref
    const geometry = new THREE.IcosahedronGeometry(2, 64);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      thickness: 1.5,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      ior: 1.5,
      reflectivity: 0.5,
    });
    
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Lighting setup for depth and sheen
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.z = 5;

    // Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.003;
      blob.rotation.x = time * 0.1;
      blob.rotation.y = time * 0.15;
      
      // Gentle deformation for that "organic" look
      const position = blob.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        const noise = Math.sin(x * 1 + time) * 0.15 + Math.cos(y * 1 + time) * 0.15;
        position.setZ(i, 2 + noise);
      }
      position.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // GSAP Reveal Title (Dribbble Ref style)
    if (titleRef.current) {
      const splitText = titleRef.current.querySelectorAll(".split-word");
      gsap.fromTo(splitText, 
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power4.out", delay: 0.4 }
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
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-20">
      {/* Three.js Background Layer */}
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-70 pointer-events-none" />
      
      {/* Navigation Label Style (Dribbble) */}
      <div className="absolute top-10 left-10 md:left-20 flex gap-12 text-[11px] font-medium text-gray-400 tracking-wider z-20">
        <span>CREATIVE STUDIO</span>
        <span>EST. 2017</span>
      </div>

      {/* Main Content (Centered exactly like Ref) */}
      <div className="relative z-10 text-center max-w-[1200px] w-full px-6">
        <h1 ref={titleRef} className="flex flex-col items-center mb-12">
          <span className="overflow-hidden h-[120px] md:h-[130px]">
            <span className="split-word block">Redefining</span>
          </span>
          <span className="overflow-hidden h-[120px] md:h-[130px]">
            <span className="split-word block italic font-light text-gray-300">Digital</span>
          </span>
          <span className="overflow-hidden h-[120px] md:h-[130px]">
            <span className="split-word block font-bold">Experience.</span>
          </span>
        </h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="hero-sub mx-auto mb-16"
        >
          Nous concevons des produits digitaux de classe mondiale pour les entreprises ambitieuses qui exigent l&apos;excellence technique et visuelle.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link href="#work" className="btn-primary flex items-center gap-3">
            Lancer un projet <span className="text-xl">→</span>
          </Link>
          <Link href="#contact" className="btn-secondary">
            Notre portfolio
          </Link>
        </motion.div>
      </div>

      {/* Footer Info Style (Dribbble) */}
      <div className="absolute bottom-10 left-10 md:left-20 text-[11px] font-medium text-gray-400 z-20">
        ALHAMBRAWeb © 2026
      </div>
      <div className="absolute bottom-10 right-10 md:right-20 flex gap-10 text-[11px] font-medium text-gray-400 z-20 uppercase tracking-widest">
        <span>Linkedin</span>
        <span>Twitter</span>
      </div>
    </section>
  );
}
