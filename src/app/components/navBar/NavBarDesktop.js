'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {HeroIcons} from "@adespota/my-react-component";

const menuLinks = [
    { name: 'Home', href: '/' },
    // { name: 'Servizi', href: '/prices' },
    { name: 'Blog', href: '/blog' },
    { name: 'Recensioni', href: '/recensioni' },
    { name: 'Faq', href: '/faq' },
];


export default function NavBarDesktop() {
    return (
        // Contenitore principale: flex e justify-between per separare i due blocchi
        <div className="relative hidden sm:flex w-full items-center justify-between mt-4 px-16">

            {/* Blocco di SINISTRA: Tutto il menu. Rimosso space-x-7 dal genitore per attaccare tutto */}
            <div className="flex items-center">

                {/* 1. Logo (attaccato al bordo grazie alla rimozione di spazio prima) */}
                <div className="w-[40px] h-[40px] mr-5 flex justify-end">
                    <Image
                        src="/1.png"
                        alt="Logo"
                        layout=""
                        width={60}
                        height={60}
                        className="flex rounded"
                    />
                </div>

                {/* 2. Links di Navigazione - Utilizziamo lo stesso space-x-7 per la spaziatura tra i link */}
                <div className="flex items-center space-x-7">
                    {menuLinks.map(link => {
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="whitespace-nowrap text-lg font-semibold leading-6 text-[#84857E] transition duration-150"
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Blocco di DESTRA: Pulsante Contattaci (spinto a destra da justify-between) */}
            <div className="flex items-center group border border-gray-500 p-1.5 rounded-2xl">
                <Link
                    href="/contatti"
                    className="whitespace-nowrap text-lg font-semibold leading-6  text-[#84857E] cursor-pointer"
                >
                    Contattaci
                </Link>
                <span
                    aria-hidden="true"
                    className="inline-block align-middle transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                >
                    <HeroIcons
                        icon={ArrowRight}
                        className="text-myColor-colorTextOnDefaultColor"
                    />
                </span>
            </div>
        </div>
    );
}
