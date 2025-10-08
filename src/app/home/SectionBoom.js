'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

// ====== Config ======
const TOTAL_ITEMS = 8;
const RADIUS = 480;       // raggio medio
const ITEM_PX = 140;      // dimensione card
const STAGGER = 0.1;      // ritardo animazioni
const START_ANGLE_DEG = -90; // rotazione globale

// Offsets deterministici (sparsi ma stabili)
const ANGLE_OFFSETS_DEG = [-1, 1, 6, -1, 12, -3, 6, -23];   // ± gradi per item
const RADIUS_OFFSETS_PX = [-239, 45, -35, 90, -55, 35, -80, 60]; // ± px per item

// Dati (come richiesto)
const ITEMS = [
    { src: '/1.png', alt: 'Copywriting SEO',                 label: 'Copywriting SEO' },
    { src: '/1.png', alt: 'Piano editoriale',                label: 'Piano editoriale' },
    { src: '/1.png', alt: 'Social media management',         label: 'Social media management' },
    { src: '/1.png', alt: 'Email marketing e automation',    label: 'Email marketing & automation' },
    { src: '/1.png', alt: 'Sviluppo siti web',               label: 'Sviluppo siti web' },
    { src: '/1.png', alt: 'SEO tecnico e indicizzazione',    label: 'SEO tecnico & indicizzazione' },
    { src: '/1.png', alt: 'SEO on-page e contenuti',         label: 'SEO on-page & contenuti' },
    { src: '/1.png', alt: 'Advertising su Google e Meta',    label: 'Advertising (Google & Meta)' },
];

// Utility
function polarToXY(radius, angleRad) {
    return { x: Math.round(radius * Math.cos(angleRad)), y: Math.round(radius * Math.sin(angleRad)) };
}
function degToRad(d) { return (d * Math.PI) / 180; }

// === Card riutilizzabile ===
function PetalCard({ src, alt, label, size = ITEM_PX, rounded = 'rounded-xl' }) {
    return (
        <div
            className={`relative overflow-hidden shadow-lg ${rounded}`}
            style={{ width: size, height: size }}
            aria-label={alt}
            title={alt}
        >
            <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
            <div className="absolute inset-x-0 bottom-1 bg-orange-500 rounded-2xl m-1 py-1 px-1.5">
                <p className="text-white text-center text-[0.75rem] font-semibold w-full leading-none">{label}</p>
            </div>
        </div>
    );
}

export default function SectionBoom() {
    const baseStepDeg = 360 / TOTAL_ITEMS;

    // Disposizione SPARSA deterministica (sempre uguale)
    const items = useMemo(() => {
        return Array.from({ length: TOTAL_ITEMS }, (_, i) => {
            const baseDeg = START_ANGLE_DEG + i * baseStepDeg;
            const angleDeg = baseDeg + (ANGLE_OFFSETS_DEG[i] ?? 0);
            const radius = RADIUS + (RADIUS_OFFSETS_PX[i] ?? 0);

            const { x, y } = polarToXY(radius, degToRad(angleDeg));
            const data = ITEMS[i % ITEMS.length];
            return { id: i + 1, x, y, ...data };
        });
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, x: 0, y: 0 },
        visible: (c) => ({
            opacity: 1,
            scale: 1,
            x: c.x,
            y: c.y,
            transition: { type: 'spring', stiffness: 80, damping: 16, duration: 1 },
        }),
    };

    return (
        <section className="relative flex flex-col items-center justify-center p-8 overflow-visible">
            <motion.div
                className="relative w-full max-w-4xl h-[60rem] flex items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ staggerChildren: STAGGER, delayChildren: 0.3 }}
            >
                {/* Card sparse e stabili */}
                {items.map((it) => (
                    <motion.div key={it.id} custom={{ x: it.x, y: it.y }} variants={itemVariants} className="absolute">
                        <PetalCard src={it.src} alt={it.alt} label={it.label} />
                    </motion.div>
                ))}

                {/* Centro (testi come richiesti) */}
                <div className="flex flex-col max-w-lg justify-center text-center pointer-events-none">
                    <h2 className="font-bold">Studio di Marketing</h2>
                    <p>
                        Specialisti di <strong>beauty &amp; wellness</strong>: chirurgia/medicina estetica, estetica
                        professionale e spa. Uniamo competenza di settore e operatività su contenuti, SEO e advertising
                        per far crescere il tuo brand.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
