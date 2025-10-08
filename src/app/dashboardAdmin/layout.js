'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import HeroIcon from '../components/HeroIcons';
import bellAlertIcon from '@heroicons/react/24/solid/esm/BellAlertIcon';
import Image from 'next/image';
import SidebarsDesktop from '../components/navDashboard/SidebarsDesktop';
import SidebarsMobile from '@/app/components/navDashboard/SidebarsMobile';
import UserDropdown from '../components/UserDropDown';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NavBar from "@/app/components/navBar/NavBar";



export default function Layout({ children, className }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isLight = searchParams.get('preview') === 'true';
    const toggleMenu = () => setIsMenuOpen(o => !o);


    useEffect(() => {
        if (isLight) {
            setLoading(false);
            return;
        }
        if (typeof window !== 'undefined') {
            const unsubscribe = onAuthStateChanged(auth, user => {
                if (!user) router.push('/login');
                else setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [router, isLight]);

    if (loading) return null;


    if (isLight) {
        return (
            <div className={`min-h-screen p-6 pt-0 ${className || ''}`}>
                <NavBar />
                {children}
            </div>
        );
    }


    return (
        <div className={`flex bg-[#f0f6fb] h-screen ${className || ''}`}>
            <SidebarsDesktop className="hidden md:inline-block" />
            <SidebarsMobile open={isMenuOpen} toggle={toggleMenu} />
            <div className="flex flex-col flex-grow bg-[#f0f6fb]">
                {/* Top bar */}
                <div className="flex px-3 md:px-12 mt-3 mb-5 items-center justify-end space-x-3">
                    {/* Hamburger mobile */}
                    <div className="flex md:hidden items-start w-full">
                        <HeroIcon
                            icon={Bars3Icon}
                            size={{ width: 'w-5', height: 'h-5' }}
                            className="text-myColor-default"
                            onClick={toggleMenu}
                        />
                    </div>
                    {/* Notifiche */}
                    <HeroIcon
                        icon={bellAlertIcon}
                        size={{ width: 'w-5', height: 'h-5' }}
                        className="text-myColor-default"
                    />
                    {/* Avatar */}
                    <Image
                        src="/avatarUomo.svg"
                        width={30}
                        height={30}
                        alt="users"
                        className="rounded-2xl"
                    />
                    {/* Dropdown Utente */}
                    <UserDropdown />
                </div>

                {/* Contenuto principale */}
                <div className="flex-1 overflow-y-auto sm:px-6 px-3.5 pb-32">
                    {children}
                </div>
            </div>
        </div>
    );
}
