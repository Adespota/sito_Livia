import React from "react";
import { FormLogin, LeftColumnLogin } from '../componentsClient/componentsClient';
import NavBar from "@/app/components/navBar/NavBar";



export const metadata = {
    title: '',
    description: '',
    author: '',
    keywords: '',
    openGraph: {
        title: '',
        description: 'Accedi alla tua dashboard personale per la gestione semplice e sicura dei tuoi servizi di consulenza psicologica e neuropsicologica online.',
        canonical: 'https://www.seolo.net/login',
        type: 'website',
        site_name: 'www.seolo.net',
        images: [
            {
                url: '',
                alt: ''

            },
        ],
    },
    canonical: 'https://www.seolo.net/login',
}



export default function LoginPage() {
    return (
        <>
            <div className="flex h-screen">
                <NavBar className="block md:hidden" />
                <LeftColumnLogin />
                <FormLogin />
            </div>
        </>
    );
}
