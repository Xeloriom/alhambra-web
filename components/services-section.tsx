'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const basePath = '/alhambra-web';

  // Récupération du JSON
  useEffect(() => {
    fetch(`${basePath}/data/services.json`)
        .then(res => res.json())
        .then(data => setServices(data))
        .catch(err => console.error("Erreur JSON:", err));
  }, []);

  const sentence = "Une agence digitale atypique concentrée sur";
  const secondLine = "la transformation de votre vision en expérience.";
  const words = sentence.split(" ");
  const words2 = secondLine.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };

  const child = {
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] } },
    hidden: { opacity: 0, y: 30, scale: 0.98 }
  };

  return (
      <section className="w-full bg-[#F8F8F8] px-16 py-32 font-haas">
        {/* LABEL & TITRE (Animation 100% restaurée) */}
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} className="block text-black text-[32px] mb-12 font-bold">
          Services
        </motion.span>

        <div className="mb-32 overflow-hidden">
          <motion.h2 variants={container} initial="hidden" whileInView="visible" className="text-[3vw] leading-[1.05] text-black font-bold tracking-tighter flex flex-wrap">
            {words.map((w, i) => (
                <motion.span variants={child as any} key={i} className="mr-[0.25em] inline-block">
                  {w === "atypique" ? (
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9C9C9C] via-[#666] to-[#9C9C9C]">
                  {w}
                </span>
                  ) : w}
                </motion.span>
            ))}
          </motion.h2>
          <motion.h2 variants={container} initial="hidden" whileInView="visible" className="text-[3vw] leading-[1.05] text-black font-bold tracking-tighter flex flex-wrap mt-2">
            {words2.map((w, i) => (
                <motion.span variants={child as any} key={i} className="mr-[0.25em] inline-block">{w}</motion.span>
            ))}
          </motion.h2>
        </div>

        {/* STACKING CARDS */}
        <div className="relative flex flex-col gap-[10vh]">
          {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // LOGIQUE DE L'OEIL : Mouvement inversé (fuit le curseur)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const moveX = (centerX - e.clientX) / 25;
    const moveY = (centerY - e.clientY) / 25;

    const limit = 12;
    setEyePos({
      x: Math.max(-limit, Math.min(limit, moveX)),
      y: Math.max(-limit, Math.min(limit, moveY))
    });
  };

  return (
      <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setEyePos({ x: 0, y: 0 })}
          // EFFET D'AGRANDISSEMENT (Scale) AJOUTÉ ICI
          initial={{ y: 150, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }} // Se rejoue au scroll
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // Ease Premium
            delay: index * 0.05
          }}
          className="sticky top-[10vh] w-full bg-[#111] rounded-[40px] p-16 h-[80vh] flex flex-col justify-between shadow-2xl"
          style={{
            marginTop: index === 0 ? 0 : `-${index * 20}px`,
            zIndex: index + 1
          }}
      >
        <div>
          <h3 className="text-white text-[8vw] font-bold leading-[0.85] tracking-tighter">
            {service.titleMain}<br />
            <span className="text-[#444]">{service.titleSub}</span>
          </h3>
        </div>

        <div className="mt-10">
          {/* TABS DYNAMIQUES */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 border-b border-white/10 pb-4">
            {service.tabs.map((tab: any, i: number) => (
                <button key={i} onClick={() => setActiveTab(i)} className="relative pb-2">
              <span className={`text-[1.2vw] font-medium transition-colors ${activeTab === i ? 'text-white' : 'text-[#555]'}`}>
                {tab.name}
              </span>
                  {activeTab === i && (
                      <motion.div layoutId={`line-${service.id}`} className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-white" />
                  )}
                </button>
            ))}
          </div>

          {/* DESCRIPTION + OEIL */}
          <div className="flex items-start gap-6 max-w-[750px]">
            <div className="relative w-14 h-14 border border-white/20 rounded-full flex items-center justify-center bg-[#1a1a1a]">
              <motion.div
                  animate={{ x: eyePos.x, y: eyePos.y }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  className="w-5 h-5 bg-white rounded-full shadow-[0_0_15px_white]"
              />
            </div>

            <div className="min-h-[100px]">
              <AnimatePresence mode="wait">
                <motion.p
                    key={activeTab}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="text-[#999] text-[1.4vw] leading-relaxed font-medium"
                >
                  {service.tabs[activeTab].text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* EFFET DE LUEUR EN FOND */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
  );
}
