'use client';

import * as React from 'react';
import {Fragment,} from 'react';
import { Transition } from '@headlessui/react';
import { useRouter, usePathname } from 'next/navigation';
import HeroIcon from '../HeroIcons';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {NAV_LINKS} from "@/app/components/navDashboard/NAV_LINKS";



export default function SidebarsMobile({open, toggle}) {
    const router = useRouter();
    const path = usePathname();


    const handleClose  = () => toggle();

    const handleLinkClick = href => {
        handleClose();
        router.push(href);
    };


    return (
        <>
            {/* Drawer */}
            <Transition.Root show={open} as={Fragment} unmount={true}>
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"   enterFrom="opacity-0" enterTo="opacity-50"
                        leave="ease-in duration-200"     leaveFrom="opacity-50" leaveTo="opacity-0"
                    >
                        <div
                            onClick={handleClose}
                        />
                    </Transition.Child>

                    {/* Panel */}
                    <div className="ml-auto flex h-full">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-out duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in duration-200"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-64 bg-white shadow-xl flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b">
                                    <button onClick={handleClose} className="p-2 focus:outline-none">
                                        <HeroIcon
                                            icon={XMarkIcon}
                                            size={{ width: 'w-6', height: 'h-6' }}
                                            className="text-gray-600"
                                        />
                                    </button>
                                </div>


                                <nav className="flex-1 overflow-y-auto px-2 py-4">
                                    <div className="space-y-2 ml-0">
                                        {NAV_LINKS.map(link => {
                                            const active = path === link.href;
                                            return (
                                                <div key={link.id}>
                                                    <p
                                                        onClick={() => handleLinkClick(link.href)}
                                                        className={`
                                                        w-full flex items-center px-3 py-2 rounded-md transition-colors
                                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a58a7] focus:ring-offset-white
                                                        active:ring-2 active:ring-offset-2 active:ring-[#4a58a7] active:ring-offset-white
                                                        ${active ? 'bg-[#4a58a7] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    >
                                                        {link.text}
                                                    </p>
                                                </div>
                                            );
                                        })}

                                    </div>
                                </nav>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
        </>
    );
}
