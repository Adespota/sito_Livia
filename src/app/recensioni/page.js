'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/app/components/navBar/NavBar';
import { Avatar } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { testimonials } from "@/app/recensioni/testimonialsData";

export default function Page() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            // Tailwind CSS 'sm' breakpoint è 640px.
            setIsMobile(window.innerWidth < 640);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const step = isMobile ? 1 : 2; // Scorri di 1 su mobile, di 2 su desktop
            return (prevIndex + step) % testimonials.length;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const step = isMobile ? 1 : 2; // Scorri di 1 su mobile, di 2 su desktop
            // Assicurati che l'indice non diventi negativo e wrappi correttamente
            return (prevIndex - step + testimonials.length) % testimonials.length;
        });
    };

    // Prepara le testimonianze da visualizzare
    // Su desktop, dobbiamo assicurarci di gestire l'indice per mostrare correttamente la seconda card.
    // Ad esempio, se siamo all'ultima testimonianza, la successiva sarà la prima.
    const getTestimonialsToShow = () => {
        if (isMobile) {
            return [testimonials[currentIndex]];
        } else {
            // Desktop: mostra currentIndex e (currentIndex + 1)
            const firstTestimonial = testimonials[currentIndex];
            const secondTestimonial = testimonials[(currentIndex + 1) % testimonials.length];
            return [firstTestimonial, secondTestimonial];
        }
    };

    const testimonialsToShow = getTestimonialsToShow();

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center w-full select-none sm:mt-5 mt-10 px-4">
                <p className="font-bold text-sm text-center">I nostri clienti</p>
                <h2 className="text-3xl text-center">Cosa dicono di noi</h2>
                <p className="max-w-2xl text-sm mt-6 text-center">
                    Scopri cosa pensano i nostri clienti dei SeoLO e di come il nostro strumento ha trasformato il loro
                    business, migliorando visibilità, traffico e conversioni.
                </p>
            </div>

            {/* Contenitore principale del carosello */}
            <div className="flex items-center justify-center w-full sm:mt-10 mt-20 px-4 sm:px-0">
                {/* Freccia INDIETRO (visibile solo su desktop) */}
                {!isMobile && (
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-4"
                    >
                        <ArrowBackIosRoundedIcon />
                    </button>
                )}

                {/* Contenitore delle recensioni */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-4xl">
                    {testimonialsToShow.map((testimonial, index) => (
                        <div
                            key={testimonial.author + index}
                            className={`flex flex-col bg-white h-full p-5  rounded-2xl flex-grow ${isMobile ? 'w-full' : 'w-1/2'}`}
                        >
                            <div className="flex sm:flex-row flex-col space-y-1 justify-between">
                                <div>{testimonial.feedback}</div>
                                <p className="text-[0.83rem] text-gray-500">{testimonial.date}</p>
                            </div>
                            <p className="mt-6 mb-5">{testimonial.content}</p>
                            <div className="bottom-4 left-4 flex flex-row space-x-1.5 items-center">
                                <Avatar>{testimonial.author.charAt(0)}</Avatar>
                                <div className="flex flex-col">
                                    <p className="font-semibold">{testimonial.author}</p>
                                    <p className="text-[0.75rem]">{testimonial.job}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isMobile && (
                        <div className="flex flex-row space-x-3 mt-4 justify-center items-center w-full">
                            <button onClick={handlePrev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                <ArrowBackIosRoundedIcon />
                            </button>
                            <button onClick={handleNext} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                <ArrowForwardIosRoundedIcon />
                            </button>
                        </div>
                    )}
                </div>

                {!isMobile && (
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-4"
                    >
                        <ArrowForwardIosRoundedIcon />
                    </button>
                )}

            </div>
        </>
    );
}
