'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = memo(({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const titleLetters = project.title.split("");

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const prefix = isGH ? '/alhambra-web' : '';
    return `${prefix}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => project.isLive && window.open(project.link, "_blank")}
          className={`relative group ${project.isLive ? 'cursor-pointer' : 'cursor-not-allowed'} will-change-transform`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[30px] bg-[#EEE] z-10">
          <motion.img
              src={getImageUrl(project.image)}
              alt={project.title}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full h-full object-cover will-change-transform ${!project.isLive && isHovered ? 'grayscale-[0.8] blur-[2px]' : ''}`}
              loading="lazy"
          />

          <div className="absolute bottom-10 left-10 z-20 flex items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: isHovered ? (project.isLive ? 1 : 0.2) : 0, x: isHovered ? 0 : -30 }} className="mr-3">
              <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.div>
            <div className="flex">
              {titleLetters.map((letter: string, i: number) => (
                  <motion.span key={i} animate={{ x: isHovered ? 20 : 0 }} transition={{ type: "spring", stiffness: 350, damping: 12, delay: isHovered ? i * 0.03 : 0 }} className="text-white text-[3.5vw] font-bold leading-none tracking-tighter inline-block whitespace-pre">
                    {letter}
                  </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
  );
});
ProjectCard.displayName = 'ProjectCard';

export function WorkSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const sentence = "Une équipe dévouée, passionnée par la création";
  const secondLine = "de réalités numériques percutantes.";
  const words = sentence.split(" ");
  const words2 = secondLine.split(" ");

  useEffect(() => {
    const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const prefix = isGH ? '/alhambra-web' : '';
    
    fetch(`${prefix}/data/projects.json`)
        .then(res => {
          if (!res.ok) throw new Error("Erreur chargement projets");
          return res.json();
        })
        .then(data => setProjects(data))
        .catch(err => console.error(err));
  }, []);

  const container = { hidden: { opacity: 0 }, visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 * i } }) };
  const child = { visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] } }, hidden: { opacity: 0, y: 40, scale: 0.95 } };

  return (
      <section className="w-full bg-[#F8F8F8] px-16 py-32 font-haas overflow-hidden" id="work">
        <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 0.5, y: 0 }} className="block text-black text-[32px] mb-12 font-bold uppercase tracking-tight">Projets</motion.span>
        <div className="mb-24">
          <motion.h2 variants={container} initial="hidden" whileInView="visible" className="text-[3vw] leading-[1.1] text-black font-bold tracking-tighter flex flex-wrap uppercase">
            {words.map((word, i) => (
                <motion.span variants={child as any} key={i} className="mr-[0.25em] inline-block">
                  {word === "passionnée" ? <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#888] to-[#333]">{word}</span> : word}
                </motion.span>
            ))}
          </motion.h2>
          <motion.h2 variants={container} initial="hidden" whileInView="visible" custom={1.2} className="text-[3vw] leading-[1.1] text-black font-bold tracking-tighter flex flex-wrap mt-2 uppercase">
            {words2.map((word, i) => (
                <motion.span variants={child as any} key={i} className="mr-[0.25em] inline-block">{word}</motion.span>
            ))}
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      </section>
  );
}
