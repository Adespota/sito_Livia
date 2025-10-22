'use client';

import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import CollapsibleDescription from "@/app/components/navBar/CollapsibleDescription";
import Link from "next/link";
import {HeroIcons} from "@adespota/my-react-component";


const mobileLinks = [
    { name: 'Home', href: '/' },
    { name: 'Prezzi', href: '/prices' },
    { name: 'Contatti', href: '/contatti' },
    { name: 'Recensioni', href: '/recensioni' },
    { name: 'Documentazione', href: '/documentation' },
    { name: 'Faq', href: '/faq' },
    { name: 'Prova gratis', href: '/dashboardAdmin/nuovoArticolo/?preview=true' },
    { name: 'Login', href: '/login' },
    /*
    {
        name: 'Servizi',
        sublinks: [
            { name: 'SEO On-Page', href: '/servizi/seo-onpage', icon: ShieldCheckIcon, description: 'Ottimizzazione interna del sito.' },
            { name: 'Link Building', href: '/servizi/link-building', icon: GlobeAltIcon, description: 'Costruzione di backlink di qualità.' },
        ],
    },
    */
];


export default function NavBarMobile({ className }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visibleSublinks, setVisibleSublinks] = useState(null);

    // Gestisce lo scroll del body quando il menu è aperto/chiuso
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // Funzione per aprire/chiudere il menu mobile
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    // Funzione per mostrare/nascondere i sottomenu
    const toggleSublinks = (name) => {
        setVisibleSublinks(visibleSublinks === name ? null : name);
    };

    return (
        <div className={`lg:hidden mb-10 ${className}`}>
            {/* Barra di navigazione fissa in alto */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4 px-4 flex items-center justify-end">
                {/* Logo a sinistra
                <div className="flex-shrink-0">
                    <Link href="/">
                        <img className="h-8 w-auto" src="/logo_seoLO.svg" alt={logoAlt} />
                    </Link>
                </div>
                */}

                {/* Pulsante Hamburger/Close a destra */}
                <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-end rounded-md p-2.5 text-gray-700"
                    onClick={toggleMobileMenu}
                >
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </header>

            {/* Overlay del menu mobile */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white flex flex-col pt-20 pb-6 overflow-y-auto"> {/* pt-20 per lasciare spazio all'header */}
                    <div className="flex flex-col space-y-3 px-4">
                        {mobileLinks.map(link => (
                            <div key={link.name}>
                                {link.sublinks ? (
                                    <>
                                        <button
                                            onClick={() => toggleSublinks(link.name)}
                                            className="block text-lg font-semibold leading-6 text-myColor-colorTextNavBar w-full text-left py-2"
                                        >
                                            <div className="w-full inline-flex justify-between items-center">
                                                <p className="font-semibold">{link.name}</p>
                                                <HeroIcons
                                                    icon={visibleSublinks === link.name ? ChevronUp : ChevronDown}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </button>
                                        {visibleSublinks === link.name && (
                                            <div className="ml-4 space-y-3 mt-3"> {/* Ridotto il margin-top */}
                                                {link.sublinks.map((sublink) => (
                                                    <Link
                                                        key={sublink.name}
                                                        href={sublink.href}
                                                        className="block text-md font-medium leading-5 text-myColor-colorTextNavBar py-1"
                                                        onClick={toggleMobileMenu} // Chiude il menu quando si clicca un sublink
                                                    >
                                                        <div className="flex flex-row items-center space-x-3">
                                                            {sublink.icon && ( // Mostra l'icona solo se presente
                                                                <div className="flex-none">
                                                                    <HeroIcons icon={sublink.icon} aria-hidden="true" />
                                                                </div>
                                                            )}
                                                            <CollapsibleDescription name={sublink.name} description={sublink.description} />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="block w-full py-2"
                                        onClick={toggleMobileMenu} // Chiude il menu quando si clicca un link principale
                                    >
                                        <div className="flex flex-row items-center justify-between">
                                            <p className="font-semibold text-left text-myColor-colorTextNavBar text-[1rem]">{link.name}</p>
                                            <HeroIcons
                                                icon={ChevronRight}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
