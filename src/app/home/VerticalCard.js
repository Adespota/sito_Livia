'use client';

import { motion } from "framer-motion";
import {
    PenTool,
    Megaphone,
    Search,
    Code2,
    Brush,
    MonitorSmartphone,
    BarChart3,
    Rocket,
} from "lucide-react";


const services = [
    {
        id: "copywriting",
        title: "Scrittura articoli",
        description: "Contenuti SEO-oriented per blog e magazine con tono di voce coerente.",
        icon: PenTool,
    },
    {
        id: "seo",
        title: "SEO & Content",
        description: "Keyword research, on-page, pillar/cluster e piani editoriali data-driven.",
        icon: Search,
    },
    {
        id: "ads",
        title: "Campagne ADV",
        description: "Meta & Google Ads: setup, creatività, A/B test e ottimizzazione continua.",
        icon: Megaphone,
    },
    {
        id: "webdev",
        title: "Sviluppo Web",
        description: "Siti veloci in React/Next.js, CMS headless e best practice di performance.",
        icon: Code2,
    },
    {
        id: "brand",
        title: "Brand Identity",
        description: "Naming, payoff, palette, logotipo e linee guida per la tua comunicazione.",
        icon: Brush,
    },
    {
        id: "social",
        title: "Social Media",
        description: "Calendari editoriali, format visual e community management efficace.",
        icon: MonitorSmartphone,
    },
    {
        id: "analytics",
        title: "Analytics & CRO",
        description: "GA4, dashboard KPI, funnel e test per aumentare conversioni e ricavi.",
        icon: BarChart3,
    },
    {
        id: "growth",
        title: "Growth Sprint",
        description: "Roadmap rapida di esperimenti per accelerare l’acquisizione utenti.",
        icon: Rocket,
    },
];

// ----------------------------------------------------
// VARIANTI FRAMER MOTION
// ----------------------------------------------------

// 1. Varianti per la singola card (gestisce l'animazione di Fade-in e Slide-up)
const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6 // Durata dell'animazione
        }
    }
};

// 2. Varianti per il contenitore (gestisce la sequenza 'stagger')
const containerVariants = {
    hidden: {}, // Stato iniziale, le card singole usano le loro varianti "hidden"
    visible: {
        transition: {
            staggerChildren: 0.1, // Ritardo di 0.1s tra l'animazione di ogni card
            delayChildren: 0.2    // Ritardo di 0.2s prima che parta la prima card
        }
    }
};



function ServiceCard({ title, description, Icon }) {
    return (
        <motion.div
            className="relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariants} // Applica le varianti di animazione
        >
            <span className="absolute -top-3 -left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#BA9659] text-white shadow-lg">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{title}</span>
            </span>

            <h5 className="pt-6 text-[1.1rem] font-semibold">{title}</h5>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
        </motion.div>
    );
}

export default function VerticalCard() {
    return (
        <section className="grid grid-cols-12 gap-6 mt-24 items-start">
            <h4 className="col-span-12 md:col-start-3 md:col-span-4 font-semibold">
                Tutti i nostri servizi
            </h4>

            <div className="col-span-12 md:col-start-7 md:col-span-5">
                {/* Il contenitore della griglia diventa motion.div e gestisce lo staggering */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    variants={containerVariants} // Applica le varianti del contenitore
                    initial="hidden"             // Stato iniziale (prima di essere visibile)
                    whileInView="visible"        // Anima quando entra nel viewport (scrolling)
                    viewport={{ once: true, amount: 0.3 }} // Anima una sola volta (once: true) quando il 30% è visibile
                >
                    {services.map(({ id, title, description, icon: Icon }) => (
                        <ServiceCard
                            key={id}
                            title={title}
                            description={description}
                            Icon={Icon}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
