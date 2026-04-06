'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Force le scroll en haut au rafraîchissement
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setIsLoading(false);
            // On attend la fin de l'anim de sortie pour libérer le scroll
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 1000);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const curve: Variants = {
        initial: {
            d: "M0 0 L100 0 L100 100 L0 100 Z",
        },
        exit: {
            d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z", // Se replie vers le haut
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="loader"
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                >
                    {/* Logo fixe qui s'efface doucement */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            transition: { duration: 0.4, ease: "easeIn" }
                        }}
                        className="relative w-[250px] h-[80px] z-50"
                    >
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            fill
                            className="object-contain invert brightness-[200%]"
                            priority
                        />
                    </motion.div>

                    {/* Le SVG permet une transition "élastique" très pro qui évite le flash blanc */}
                    <svg className="absolute top-0 w-full h-[calc(100%+300px)] fill-black -z-10">
                        <motion.path
                            variants={curve}
                            initial="initial"
                            exit="exit"
                        />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
}