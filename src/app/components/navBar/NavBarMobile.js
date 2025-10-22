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
    { name: 'Documentazione', href: '/documentation' },
    { name: 'Recensioni', href: '/recensioni' },
    { name: 'Faq', href: '/faq' },
    { name: 'Prova gratis', href: '/dashboardAdmin/nuovoArticolo/?preview=true' },
    { name: 'Login', href: '/login' },
];


export default function NavBarMobile({ className }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visibleSublinks, setVisibleSublinks] = useState(null);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const toggleSublinks = (name) => {
        setVisibleSublinks(visibleSublinks === name ? null : name);
    };


    return (
        <div className={`${className}`} >
            {/* Bottone per aprire il menu mobile */}
            <button
                type="button"
                className="fixed top-[74.5%] -right-2 z-50 inline-flex items-center boxShadow_custom rounded-xl h-14 w-14 justify-center py-4.5 text-gray-700 bg-white"
                onClick={toggleMobileMenu}
            >
                <span className="sr-only">Open main menu</span>
                <div className="flex flex-col -space-y-1 pt-3 justify-center items-center">
                    <div>
                        {!mobileMenuOpen ? <Menu className="h-6 w-6" aria-hidden="true" /> : <X className="h-6 w-6" aria-hidden="true" />}
                    </div>
                    <p className="text-[9px]">Menu</p>
                </div>
            </button>

            {/* Menu mobile */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    <div className="flex flex-col space-y-3 px-4 pt-16 bg-gray-100 w-full h-full">
                        {mobileLinks.map(link => (
                            <div key={link.name}>
                                {link.sublinks ? (
                                    <>
                                        <button
                                            onClick={() => toggleSublinks(link.name)}
                                            className="block text-lg font-semibold leading-6 text-myColor-colorTextNavBar w-full text-left"
                                        >
                                            <div className="w-full inline-flex justify-between">
                                                <p className="font-semibold">{link.name}</p>
                                                <HeroIcons
                                                    icon={visibleSublinks === link.name ? ChevronUp : ChevronDown}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </button>
                                        {visibleSublinks === link.name && (
                                            <div className="ml-4 space-y-3 mt-4">
                                                {link.sublinks.map((sublink) => (
                                                    <Link
                                                        key={sublink.name}
                                                        href={sublink.href}
                                                        className="block text-md font-medium leading-5 text-myColor-colorTextNavBar"
                                                        onClick={toggleMobileMenu}
                                                    >
                                                        <div className="flex flex-row items-start space-x-3">
                                                            <div className="flex-none">
                                                                <HeroIcons icon={sublink.icon} aria-hidden="true" />
                                                            </div>
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
                                        className="block w-full"
                                        onClick={toggleMobileMenu}
                                    >
                                       <div className="flex flex-row items-center justify-between">
                                           <p className="font-semibold text-left text-myColor-colorTextNavBar text-[1rem]">{link.name}</p>
                                           <HeroIcons
                                               icon={ChevronRight}
                                               aria-hidden="true" />
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

