'use client';

import React, {useEffect, useRef, useState} from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const initialReviews = [
    {
        id: 1,
        rev: 0,
        name: 'Oscar',
        rating: 4,
        job: 'Genio',
        firstTitle: 'Impeccabili',
        description: 'Servizio impeccabile dall’accoglienza alla consegna: tempi rapidi, spiegazioni chiare e un’attenzione autentica ai dettagli. Mi sono sentita seguita, ascoltata e valorizzata. Esperienza che consiglierei senza esitazioni, davvero eccellente.'
    },
    {
        id: 2,
        rev: 0,
        name: 'Livia',
        rating: 4,
        job: 'Genio',
        firstTitle: 'Ottimo Servizio',
        description: 'Personale preparato, cortese e puntuale: hanno capito subito le mie esigenze e proposto soluzioni pratiche. Ambiente pulito, sicuro e curato. Ho ottenuto risultati concreti già dalle prime sedute, oltre le aspettative.'
    },
    {
        id: 3,
        rev: 0,
        name: 'Mario Rossi',
        rating: 3,
        job: 'Genio',
        firstTitle: 'Assolutamente da Provare',
        description: 'Servizio efficace e organizzato: prenotazione semplice, orari rispettati e spiegazioni comprensibili. Mi hanno guidato passo dopo passo con professionalità e gentilezza. Tornerò volentieri perché ho visto progressi reali in poco tempo.'
    },
    {
        id: 4,
        rev: 0,
        name: 'Sara Verdi',
        job: 'Genio',
        firstTitle: 'Esperienza Top',
        description: 'Accoglienza calorosa e competenza tecnica si uniscono in un percorso chiaro. Ogni seduta è personalizzata sugli obiettivi, con indicazioni utili da seguire a casa. Ho percepito cura, precisione e reale attenzione al dettaglio.'
    },
    {
        id: 5,
        rev: 0,
        name: 'Giulia Bianchi',
        firstTitle: 'Professionalità e Cortesia',
        description: 'Studio ordinato, luminoso e silenzioso; strumenti moderni e protocolli spiegati con calma. Ho apprezzato la chiarezza nel comunicare i passaggi e i tempi. Mi sono sentita in mani esperte, con risultati soddisfacenti.'
    },
    {
        id: 6,
        rev: 0,
        name: 'Elena Neri',
        rating: 4,
        firstTitle: 'Consigliatissimo',
        description: 'Esperienza molto positiva: valutazione iniziale accurata, obiettivi realistici e monitoraggio costante. Ho visto miglioramenti visibili già nelle prime settimane. Consigli pratici da seguire tra una seduta e l’altra hanno accelerato ulteriormente i progressi.'
    },
    {
        id: 7,
        rev: 0,
        name: 'Paolo Conti',
        firstTitle: 'Servizio Impeccabile',
        description: 'Professionalità e precisione in ogni fase: dall’appuntamento al follow-up. Mi hanno dedicato il tempo necessario per chiarire dubbi e aspettative. L’approccio è metodico ma umano, con risultati tangibili e misurabili.'
    },
    {
        id: 8,
        rev: 0,
        name: 'Federica Moretti',
        firstTitle: 'Team Fantastico',
        description: 'Team affiatato e comunicazione limpida: sanno ascoltare e spiegare. Ho ricevuto un piano personalizzato con obiettivi chiari e verifiche periodiche. Mi sono sentita accompagnata con delicatezza, senza promesse irrealistiche, ma con fatti.'
    },
    {
        id: 9,
        rev: 0,
        name: 'Chiara Lombardi',
        rating: 4,
        firstTitle: 'Qualità al Top',
        description: 'Qualità elevata e attenzione costante al benessere. Ogni dettaglio è curato, dai tempi di attesa alle indicazioni post-trattamento. Sono uscita più serena e consapevole, con benefici concreti che sto mantenendo nel tempo.'
    },
    {
        id: 10,
        rev: 0,
        name: 'Davide Marchetti',
        firstTitle: 'Esperienza Eccellente',
        description: 'Ottimo rapporto qualità-prezzo, ma soprattutto competenza. Il percorso è strutturato, con obiettivi progressivi e verifiche chiare. Ho ottenuto miglioramenti misurabili e una routine semplice da seguire per consolidare i risultati raggiunti.'
    }
];

function Stars({ rating = 5, size = 16, className = '' }) {
    const full = Math.max(0, Math.min(5, Math.floor(rating)));
    return (
        <div className={`flex items-center gap-1 ${className}`} aria-label={`${full} su 5`}>
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < full;
                return (
                    <svg
                        key={i}
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        className={filled ? 'text-yellow-500' : 'text-gray-300'}
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                );
            })}
        </div>
    );
}


function Card({ data, isTop, onSwipeDone }) {
    const x = useMotionValue(0);
    const o = useMotionValue(1);

    // tilt iniziale fisso per la card: tra -10 e +10 gradi
    const baseTiltRef = useRef(
        (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5) // 5°–10° verso dx/sx
    );

    // rotazione dovuta al trascinamento
    const dragRotate = useTransform(x, [-300, 300], [-12, 12]);
    // rotazione totale = tilt iniziale + rotazione da drag
    const combinedRotate = useTransform(dragRotate, v => v + baseTiltRef.current);

    const onDragEnd = async (_, info) => {
        const threshold = 120;
        const far = Math.abs(info.offset.x) > threshold;
        const fast = Math.abs(info.velocity.x) > 800;

        if (isTop && (far || fast)) {
            const dir = (info.offset.x > 0 || info.velocity.x > 0) ? 1 : -1;
            const fly = animate(x, dir * 600, { duration: 0.28 });
            const fade = animate(o, 0, { duration: 0.28 });
            await Promise.all([fly.finished, fade.finished]);
            onSwipeDone(data.id);
            return;
        }

        animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    };

    const scale = isTop ? 1 : 0.97;
    const y = isTop ? 0 : 6;
    const zIndex = isTop ? 10 : 1;

    return (
        <motion.div
            className="absolute w-full max-w-sm h-[19rem] bg-white border border-gray-100 rounded-2xl p-6 -mt-28"
            style={{ x, opacity: o, rotate: combinedRotate, scale, y, zIndex }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
            dragElastic={0.85}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale, y }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
            <div className="flex flex-col space-y-2">
                 <Stars rating={data.rating ?? 5} size={12} />
                <p className="font-bold">{data.firstTitle}</p>
                <p className="mt-1">{data.description}</p>
            </div>


            <div className="flex flex-col space-y-1 mt-2">
                <p className="font-extrabold">{data.name}</p>
                <p className="">{data.job}</p>
            </div>
        </motion.div>
    );
}


export default function Reviews() {
    const [reviews, setReviews] = useState(initialReviews);
    const [stackRev, setStackRev] = useState(0);

    const resetAll = () => {
        setReviews(initialReviews.map(r => ({ ...r, rev: 0 })));
        setStackRev(v => v + 1); // forza remount di tutte le card
    };

    useEffect(() => {
        if (reviews.length === 0) {
            const t = setTimeout(resetAll, 600);
            return () => clearTimeout(t);
        }
    }, [reviews.length]);

    // 🔧 Metti a true se vuoi il comportamento "loop" (le card scartate tornano in fondo)
    const loop = false;

    const handleSwipeDone = (id) => {
        setReviews(prev => {
            const idx = prev.findIndex(r => r.id === id);
            if (idx === -1) return prev;
            const card = prev[idx];
            const rest = prev.filter(r => r.id !== id);

            if (!loop) {
                return rest;
            }

            // 🔁 ricicla: re-inserisci in fondo forzando il remount con rev++
            const updated = { ...card, rev: (card.rev || 0) + 1 };
            return [...rest, updated];
        });
    };

    // render a pila: l’ultima è la top card
    return (
        <>
            <div className="flex flex-col justify-center items-center mt-36">
                <h4>Cosa dicono i nostri clienti</h4>
                <p>Non affidarti alle nostra parole ma affidati alle recensioni dei nostri clienti</p>
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="relative w-full max-w-sm h-80">
                    {reviews.map((review, i) => {
                        const isTop = i === reviews.length - 1;
                        return (
                            <Card
                                key={`${review.id}-${review.rev}`}
                                data={review}
                                isTop={isTop}
                                onSwipeDone={handleSwipeDone}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
