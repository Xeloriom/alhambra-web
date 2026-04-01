"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const projects = [
    {
        title: "Plateforme SaaS AI",
        category: "Product • Next.js",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        size: "large"
    },
    {
        title: "Application Mobile Fintech",
        category: "Mobile • React Native",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        size: "small"
    },
    {
        title: "E-commerce Premium",
        category: "Web • Performance",
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
        size: "small"
    },
    {
        title: "Dashboard Logistique",
        category: "SaaS • Real-time",
        image: "https://images.unsplash.com/photo-1551288049-bbda0231f1a5?auto=format&fit=crop&w=1200&q=80",
        size: "large"
    }
];

interface ProjectCardProps {
    project: typeof projects[0];
    index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as any }}
            className="group gpu"
        >
            <div className={`relative rounded-[24px] overflow-hidden mb-6 shadow-sm border border-[#EBEBEB] gpu ${
                project.size === "large" ? "aspect-[3/4]" : "aspect-[4/5]"
            }`}>
                <motion.img
                    style={{ y }}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[110%] object-cover transition-all duration-1000 group-hover:scale-105 gpu"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700" />

                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="btn-pill justify-between w-full text-[12px] py-4">
                        Voir le projet <span>↗</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className="text-[18px] font-medium tracking-tight mb-1 text-[#0A0A0A]">
                        {project.title}
                    </h3>
                    <p className="label !text-[10px]">{project.category}</p>
                </div>
                <div className="w-9 h-9 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[14px] group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                    →
                </div>
            </div>
        </motion.div>
    );
}

interface WorksSectionProps {
    data?: any;
    onUpdate?: (path: string, value: any) => void;
    isEditing?: boolean;
}

export function WorksSection({ data, onUpdate, isEditing }: WorksSectionProps) {
    return (
        <section id="works" className="bg-[#F9F9F9] py-36 px-8 overflow-hidden gpu">
            <div className="max-w-[1400px] mx-auto">

                <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="label mb-5 block"
                        >
                            Projets Sélectionnés
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }}
                            className="text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.93] tracking-[-0.03em] gpu"
                        >
                            Impact<br />
                            <span className="italic text-[#BBBBBB]">Digital.</span>
                        </motion.h2>
                    </div>

                    <Link href="#contact" className="btn-pill text-[12px] mb-2 px-8 py-4">
                        Tous les projets <span>↗</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-5">
                        <ProjectCard project={projects[0]} index={0} />
                    </div>
                    <div className="md:col-span-7 flex flex-col gap-8 justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-[24px] border border-[#EBEBEB] shadow-sm"
                        >
                            <p className="label mb-4">Notre Engagement</p>
                            <p className="text-[clamp(1.2rem,2vw,1.8rem)] leading-[1.3] tracking-[-0.02em] text-[#0A0A0A]">
                                "Nous bâtissons des outils qui<br />
                                <span className="italic text-[#9A9A9A]">propulsent votre croissance.</span>"
                            </p>
                            <div className="mt-8 flex items-center gap-3">
                                <img src="https://i.pravatar.cc/40?img=11" className="w-9 h-9 rounded-full" alt="Team" />
                                <div>
                                    <p className="text-[13px] font-medium">Alhambra Studio</p>
                                    <p className="text-[11px] text-[#9A9A9A]">Équipe d'experts IT</p>
                                </div>
                            </div>
                        </motion.div>
                        <ProjectCard project={projects[1]} index={1} />
                    </div>

                    <div className="md:col-span-7">
                        <ProjectCard project={projects[2]} index={2} />
                    </div>
                    <div className="md:col-span-5">
                        <ProjectCard project={projects[3]} index={3} />
                    </div>
                </div>
            </div>
        </section>
    );
}
