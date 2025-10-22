'use client';

import React from 'react';
import { FormContact } from '/src/app/componentsClient/componentsClient';
import { EmailRounded } from "@mui/icons-material";
import {HeroIcons} from "@adespota/my-react-component";


/*
export const metadata = {
    title: '',
    description:
        '',
    author: '',
    keywords:
        '',
    openGraph: {
        title: '',
        description:
            '',
        canonical: '',
        type: 'website',
        site_name: '',
        images: [
            {
                url: '',
                alt: '',
            },
        ],
    },
    canonical: 'https://www.seolo.net/contatti',
}

 */






function Card({ icon: Icon, title, text, iconSize = { width: "w-7", height: "h-7" }, iconClass = "text-myColor-default pt-1" }) {
    return (
        <div className="rounded-2xl border border-gray-100 sm:p-6 p-3 bg-white">
            <div className="flex sm:flex-row flex-col items-center sm:items-start">
                {Icon && (
                    <div className="basis-1/6 sm:mb-0 mb-2">
                        <HeroIcons
                            icon={Icon}
                            size={iconSize}
                            className={iconClass}
                        />
                    </div>
                )}
                <div className="w-full sm:text-left text-center">
                    <p className="text-lg font-semibold mb-0.5">{title}</p>
                    <p className="">{text}</p>
                </div>
            </div>
        </div>
    );
}

export default function PageContact() {
    return (
        <>
            <div className="grid sm:grid-cols-12 grid-cols-1 gap-x-10 mt-32 mb-20 sm:space-y-0 space-y-4 px-4">
                {/* Sezione delle card */}
                <div className="sm:col-start-3 sm:col-span-4">
                    <div className="flex flex-col space-y-4">
                        <Card
                            icon={EmailRounded}
                            title="help.seolo@outlook.it"
                            text="Email servizio clienti e supporto tenico"
                        />
                    </div>
                </div>
                <div className="sm:col-start-7 sm:col-span-5">
                    <FormContact />
                </div>
            </div>
        </>
    );
}
