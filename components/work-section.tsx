'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
    id: string | number;
    title: string;
    image: string;
    link: string;
    isLive: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function getImageUrl(url: string): string {
    if (url.startsWith('http')) return url;
    const isGH =
        typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const prefix = isGH ? '/alhambra-web' : '';
    return `${prefix}${url.startsWith('/') ? '' : '/'}${url}`;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
};

const wordVariants = {
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.05, ease: EASE_EXPO },
    },
    hidden: { opacity: 0, y: 40, scale: 0.96 },
};

// ─── Project card ─────────────────────────────────────────────────────────────
const ProjectCard = memo(function ProjectCard({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { playClick, playHover } = useSatisfyingSounds();
    const imageUrl = getImageUrl(project.image);
    const titleLetters = project.title.split('');

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        playHover();
    }, [playHover]);

    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const handleClick = useCallback(() => {
        playClick();
        if (!project.isLive) return;
        if (project.link.startsWith('http')) {
            window.open(project.link, '_blank');
        } else {
            const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
            window.open(`${isGH ? '/alhambra-web' : ''}${project.link}`, '_blank');
        }
    }, [playClick, project.isLive, project.link]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, delay: index * 0.07, ease: EASE_EXPO }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={`relative group ${project.isLive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ willChange: 'transform, opacity' }}
        >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] bg-[#EBEBEB]">
                <div
                    className="absolute inset-0 transition-transform duration-[1400ms]"
                    style={{
                        transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: isHovered ? 'transform' : 'auto',
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className={`object-cover transition-all duration-700 ${
                            !project.isLive && isHovered ? 'grayscale blur-[2px]' : ''
                        }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                        quality={80}
                    />
                </div>

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500"
                    style={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Title + arrow */}
                <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 z-20 flex items-center pointer-events-none">
                    <div
                        className="mr-2 sm:mr-3 transition-all duration-300"
                        style={{
                            opacity: isHovered ? (project.isLive ? 1 : 0.2) : 0,
                            transform: isHovered ? 'translateX(0)' : 'translateX(-28px)',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <svg
                            width="clamp(18px, 2.2vw, 36px)"
                            height="clamp(18px, 2.2vw, 36px)"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3.5"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="flex">
                        {titleLetters.map((letter, i) => (
                            <motion.span
                                key={i}
                                animate={{ x: isHovered ? 18 : 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 320,
                                    damping: 14,
                                    delay: isHovered ? i * 0.025 : 0,
                                }}
                                className="text-white font-nordique leading-none tracking-tighter inline-block whitespace-pre"
                                style={{
                                    fontSize: 'clamp(22px, 3.2vw, 52px)',
                                    willChange: 'transform',
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 sm:top-5 lg:top-6 right-4 sm:right-5 lg:right-6 z-20">
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-haas font-bold tracking-[0.2em] uppercase transition-opacity duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        } ${project.isLive ? 'bg-black/50 text-white' : 'bg-white/20 text-white/60'}`}
                    >
                        <span
                            className={`w-[5px] h-[5px] rounded-full ${
                                project.isLive ? 'bg-emerald-400' : 'bg-white/40'
                            }`}
                        />
                        {project.isLive ? 'Voir le site' : 'Bientôt'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ProjectCard.displayName = 'ProjectCard';

// ─── Work section ─────────────────────────────────────────────────────────────
export function WorkSection() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const isGH =
            typeof window !== 'undefined' && window.location.hostname.includes('github.io');
        const prefix = isGH ? '/alhambra-web' : '';
        fetch(`${prefix}/data/projects.json`)
            .then((res) => {
                if (!res.ok) throw new Error('Erreur chargement projets');
                return res.json();
            })
            .then((data: Project[]) => setProjects(data))
            .catch(console.error);
    }, []);

    const line1 = 'Une équipe dévouée, passionnée par la création'.split(' ');
    const line2 = 'de réalités numériques percutantes.'.split(' ');

    return (
        <section
            className="w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32 font-haas overflow-hidden"
            id="work"
            aria-label="Nos projets — portfolio Alhambra Studio"
        >
            {/* Label */}
            <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 0.5, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                className="block text-black text-[24px] sm:text-[28px] lg:text-[32px] mb-10 sm:mb-12 lg:mb-14 font-bold tracking-tight"
            >
                Projets
            </motion.span>

            {/* Headline */}
            <div className="mb-14 sm:mb-20 lg:mb-24">
                {[line1, line2].map((words, lineIdx) => (
                    <motion.h2
                        key={lineIdx}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        className="leading-[1.08] text-black font-bold tracking-tighter flex flex-wrap"
                        style={{ fontSize: 'clamp(22px, 3.5vw, 56px)' }}
                    >
                        {words.map((word, i) => (
                            <motion.span
                                variants={wordVariants}
                                key={i}
                                className="mr-[0.25em] inline-block"
                            >
                                {word === 'passionnée' ? (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#888] to-[#333]">
                                        {word}
                                    </span>
                                ) : (
                                    word
                                )}
                            </motion.span>
                        ))}
                    </motion.h2>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}
