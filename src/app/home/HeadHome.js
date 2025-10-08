'use client';

import React from 'react';
import {HeroIcon} from "@/app/componentsClient/componentsClient";
import {ArrowRightIcon} from "@heroicons/react/20/solid";
import NavBar from "@/app/components/navBar/NavBar";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle,} from "@/styles/constants";
import Image from 'next/image';


export default function HeadHome() {
    return (
        <>
            <NavBar />

            {/* Contenitore principale centrato e con larghezza limitata */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center py-10">

                    {/* Linee e Marketing */}
                    <div className="flex items-center justify-center">
                        <div className="w-8 border-t-2 border-gray-400"></div>

                        {/* Colore del testo leggermente più scuro per consistenza */}
                        <p className="flex-shrink-0 mx-2 text-xl font-semibold text-[0.8rem]">
                            Marketing
                        </p>

                        <div className="w-8 border-t-2 border-gray-400"></div>
                    </div>

                    {/* Testo Principale */}
                    <h1 className="text-center mb-4 mt-10 text-5xl sm:text-5xl lg:text-6xl font-extrabold">
                        STUDIO DI MARKETING DIGITALE
                    </h1>

                    <p className="text-center text-xl max-w-2xl mx-auto mb-8">
                        Innovazione e strategia si fondono per il tuo successo digitale.
                        Affidati alla nostra esperienza per risultati che contano.
                    </p>
                    <div className="flex flex-row justify-center items-center space-x-1.5 -4 max-w-sm mx-auto">
                        <Button
                            buttonTextDesktop="Chi siamo"
                            backgroundColor={backgroundButtonStyle}
                        />
                        <button
                            type="button"
                            className="border border-gray-400 rounded-lg p-1.5 w-full sm:w-auto text-[#212121] font-semibold"
                        >
                            I nostri servizi
                        </button>

                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12">
                <div className="col-start-2 col-span-10">
                    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
                        <Image
                            src="/1.png"
                            alt="Hero"
                            fill
                            sizes="(min-width:1024px) 83vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>




        </>
    );
}
