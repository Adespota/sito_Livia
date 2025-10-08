'use client';

import { useEffect, useState } from 'react';
import NavBarDesktop from "@/app/components/navBar/NavBarDesktop";
import NavBarMobile from "@/app/components/navBar/NavBarMobile";
import NavBarMobileTop from "@/app/components/navBar/NavBarMobileTop";



export default function NavBar({ className }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);



    return (
        <header className={className}>
            <nav className="w-full flex" aria-label="Global">
                <NavBarMobileTop />
                <NavBarDesktop className="hidden md:flex" />
            </nav>
        </header>
    );
}
