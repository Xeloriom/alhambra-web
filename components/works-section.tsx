"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

function ProjectCard({ title, category, image }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden cursor-none group"
    >
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute bottom-10 left-10 translate-z-20 text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-500">
        <span className="label-mono text-white/70 text-[10px] mb-2 block">{category}</span>
        <h3 className="text-3xl font-serif">{title}</h3>
      </div>
    </motion.div>
  );
}

export function WorksSection() {
  return (
    <section id="work" className="bg-white py-64 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-32">
          <h2 className="text-[clamp(48px,8vw,120px)]">Selected <br /><span className="italic">Archives.</span></h2>
          <div className="label-mono mb-6">ALHAMBRAWeb © 2026</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <ProjectCard title="EcoSphere" category="Sustainable OS" image="/p1.jpg" />
          <ProjectCard title="Nova App" category="Fintech Experience" image="/p2.jpg" />
        </div>
      </div>
    </section>
  );
}
