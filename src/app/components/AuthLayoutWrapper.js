'use client';

import React from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import {LayoutDashboard} from "@adespota/my-react-component";
import {
    Home,
    Newspaper,
    FilePlus,
    Send,
    Pencil,
    ArrowLeft,
} from "lucide-react";


const links = [
    {
        id: "1",
        text: "Inizio",
        icon: Home,
        href: "/dashboardAdmin"
    },
    {
        id: "2",
        text: "Articoli",
        icon: Newspaper,
        subLinks: [
            {
                id: "2-1",
                text: "Nuovo articolo",
                icon: FilePlus,
                href: "/dashboardAdmin/nuovoArticolo"
            },
            {
                id: "2-2",
                text: "Articoli bozze",
                icon: Pencil,
                href: "/dashboardAdmin/articoliBozze"
            },
            {
                id: "2-3",
                text: "Articoli inviati",
                icon: Send,
                href: "/dashboardAdmin/articoliInviati"
            },
        ],
    },
];


export default function AuthLayoutWrapper({ children, className }) {
    // 1. Esegui l'hook che gestisce tutta la logica di Firebase Auth
    const { user, loading, isAuthenticated } = useRequireAuth();
    const userEmail = user?.email || '';



    // 2. Il componente non deve fare reindirizzamenti espliciti qui,
    // perché l'hook se ne occupa. Dobbiamo solo gestire il rendering in base allo stato.


    return (
        <LayoutDashboard
            className={className}
            classNameAreaDashboard="px-6 pb-12"
            sidebarClassName="bg-[#626842]"
            isLoading={loading}
            isAuthenticated={isAuthenticated}
            links={links}
            iconSidebar={ArrowLeft}
            backgroundColorButtonSidebar="bg-[#7a8157]"
            hover="hover:bg-[#7a8157]"
            userName={userEmail}
            userImage="/1.png"
            children={children}
        >
        </LayoutDashboard>
    );
}
