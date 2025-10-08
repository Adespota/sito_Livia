'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { List, Skeleton, Badge } from '@mui/material';
import HeroIcon from '../HeroIcons';
import { commonIcons } from '../navDashboard/iconData';
import {NAV_LINKS} from "@/app/components/navDashboard/NAV_LINKS";

// Lazy-load di framer-motion per l’animazione dell’icona
const MotionDiv = dynamic(
    () => import('framer-motion').then(mod => mod.motion.div),
    { ssr: false }
);



const ACTIVE_LINK_CLASSES  = 'bg-[#5c6ed3] text-white';
const DEFAULT_LINK_CLASSES = 'hover:bg-[#5c6ed3] text-gray-700';
const ICON_COLOR_CLASSES   = 'text-gray-200';
const DEFAULT_ICON_SIZE    = { width: 'w-[1.2rem]', height: 'h-[1.2rem]' };

export default function SidebarsDesktop({ className, onLinkClick }) {
    const router        = useRouter();
    const pathname      = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const { arrowMenuClose } = commonIcons;

    const handleToggleMenu = () => setIsMenuOpen(open => !open);
    const isIconRotated = !isMenuOpen;
    const showText      = isMenuOpen;



    const handleLinkClick = link => {
        // chiude il menu (se vuoi far collassare la sidebar)
        setIsMenuOpen(false);
        // naviga verso la pagina
        router.push(link.href);
        // callback esterno, se fornito
        if (onLinkClick) onLinkClick(link);
    };

    return (
        <div className={className}>
            <div className="flex h-screen">
                <div className={`bg-[#4a58a7] max-h-screen overflow-y-auto transition-width duration-300 ease-in-out ${isMenuOpen ? 'w-[13rem]' : 'w-[3.8rem]'}`}>
                    <div className="flex w-9 items-center justify-center bg-[#5c6ed3] rounded-[6px] py-1.5 mb-6 ml-3 mt-5 cursor-pointer"
                        onClick={handleToggleMenu}
                        aria-label={isMenuOpen ? 'Riduci menu' : 'Espandi menu'}
                    >
                        <MotionDiv
                            whileHover={{ scale: 1.2 }}
                            whileTap={{   scale: 1.1 }}
                            animate={{ rotate: isIconRotated ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <HeroIcon
                                icon={arrowMenuClose}
                                size={{ width: 'w-4', height: 'w-4' }}
                                iconColor="white"
                                tooltipText={isMenuOpen ? 'Riduci menu' : 'Espandi menu'}
                                tooltipPosition="right"
                            />
                        </MotionDiv>
                    </div>

                    {/* Skeleton se i link fossero vuoti */}
                    {NAV_LINKS.length === 0 ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center${isMenuOpen ? 'ml-2 mr-5' : 'justify-center'}px-2 py-2.5`}>
                                <Skeleton
                                    variant="rounded"
                                    height={26}
                                    width={isMenuOpen ? 28 : 26}
                                />
                                {isMenuOpen && (
                                    <Skeleton
                                        variant="rounded"
                                        height={26}
                                        width={135}
                                        className="ml-4"
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <List component="nav">
                            {NAV_LINKS.map(link => {
                                const active = pathname === link.href;
                                return (
                                    <div
                                        key={link.id}
                                        className={`flex flex-col ${showText ? 'mx-2.5' : 'mx-3'} px-1 mt-1 rounded-lg cursor-pointer ${DEFAULT_LINK_CLASSES} ${active ? ACTIVE_LINK_CLASSES : ''}`}
                                        tabIndex={0}
                                        onClick={() => handleLinkClick(link)}>
                                        <div className={`flex items-center px-1 py-1 ${isMenuOpen ? 'justify-start': 'justify-center py-1.5 px-0'}`}>
                                            {link.icon && (
                                                <Badge
                                                    badgeContent={0}
                                                    color="error"
                                                    invisible={true}
                                                    overlap="circular"
                                                    anchorOrigin={{
                                                        vertical:   'top',
                                                        horizontal: 'right'
                                                    }}
                                                >
                                                    <HeroIcon
                                                        icon={link.icon}
                                                        size={DEFAULT_ICON_SIZE}
                                                        iconColor={active ? 'white' : 'currentColor'}
                                                        className={`${showText ? 'mr-3' : 'mr-0'} ${ICON_COLOR_CLASSES} `}
                                                        tooltipText={link.text}
                                                        tooltipPosition="right"
                                                    />
                                                </Badge>
                                            )}
                                            {showText && (
                                                <p className={` font-semibold text-[0.82rem] mr-4 text-gray-200 ${active ? 'text-white' : ''} `}
                                                    style={{ whiteSpace: 'nowrap' }}>
                                                    {link.text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </List>
                    )}
                </div>
            </div>
        </div>
    );
}
