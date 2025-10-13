'use client';

import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCategories} from "@/reducer/features/articoloSlice";
import {setSelectedCategory} from "@/reducer/features/articleBlogSlice";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle} from "@/styles/constants";


// Definizione delle sezioni del footer, ognuna con titolo e collegamenti o contenuti
const footerSections = [
    {
        title: "WOOKIES - Copyright © 2025",
        content: [
            {
                text: "Agenzia di marketing digitale innovativa e proattiva, specializzata in strategie " +
                    "full-funnel e ottimizzazione conversione. Eleviamo la tua presenza online con soluzioni data-driven," +
                    " garantendo risultati misurabili e un ROI tangibile. Dalla SEO avanzata alle campagne social mirate," +
                    " trasformiamo la tua visione in successo digitale duraturo.",
                url: "https://www.oprc.it/albo/risultati-ricerca/?nome=Oscar&cognome=Prata&provincia="
            },
        ],
    },
    {
        title: "Naviga",
        links: [
            {text: "Home", url: "/"},
            //{text: "Servizi", url: "/"},
            //{text: "Chi sono", url: "/chisono"},
            {text: "Blog", url: "/blog"},
            {text: "Recensioni", url: "/"},
            {text: "Contatti", url: "/contatti"},
            {text: "Faq", url: "/faq"},
        ],
    },
    {
        title: "Servizi",
        links: [
            { text: "Copywriting SEO",               url: "/servizi/copywriting-seo" },
            { text: "Piano editoriale",              url: "/servizi/piano-editoriale" },
            { text: "Social media management",       url: "/servizi/social-media-management" },
            { text: "Email marketing & automation",  url: "/servizi/email-marketing-automation" },
            { text: "Sviluppo siti web",             url: "/servizi/sviluppo-siti-web" },
            { text: "SEO tecnico & indicizzazione",  url: "/servizi/seo-tecnico-indicizzazione" },
            { text: "SEO on-page & contenuti",       url: "/servizi/seo-on-page-contenuti" },
            { text: "Advertising (Google & Meta)",   url: "/servizi/advertising-google-meta" },
        ],
    },
    {
        title: "Blog",
    },
    {
        title: "Contatti",
        links: [
            {text: "oscarprata@hotmail.it", url: null},
            {text: "oscarprata@psy.it", url: null},
            {text: "+39 346 3996438", url: null},
        ],
    },
    {
        title: "Legal",
        links: [
            {text: "Privacy policy", url: "https://www.iubenda.com/privacy-policy/17029455"},
            {text: "Cookie policy", url: "https://www.iubenda.com/privacy-policy/17029455/cookie-policy"},
            {text: "Termini e condizioni", url: "https://www.iubenda.com/termini-e-condizioni/17029455"},
        ],
    },
];

// Classi CSS per la formattazione delle diverse sezioni
const sectionClasses = [
    // Prima colonna
    "order-last md:order-first text-center md:text-left lg:col-start-1 md:col-span-2 col-span-1",
    // Seconda colonna
    "text-center md:text-left",
    // Terza colonna
    "text-center md:text-justify",
    // Quarta colonna
    "order-2 text-center md:text-justify",
    // Quinta colonna
    "order-2 text-center md:text-justify",
    // Sesta colonna
    "order-2 text-center md:text-justify",
];


export default function Footer() {
    const categories = useSelector(selectCategories) || [];
    const router = useRouter();
    const dispatch = useDispatch();

    const handleCategoryClick = (category) => {
        dispatch(setSelectedCategory(category)); // Seleziona la categoria
        console.log(" =>", category)
        router.push('/blog');
    };


    return (
        <footer className="bg-[#626842] text-white py-6 px-6 m-4 rounded-2xl pb-10">
            <div className="w-full rounded-2xl bg-white p-3 min-h-[280px] mb-20">
                <div className="flex flex-col items-center justify-center space-y-2.5 max-w-2xl w-full mx-auto">
                    <h5 className="text-center">Sei pronto a lanciare la tua nuova strategia di marketing?</h5>
                    <p className="text-center">
                        Parlaci della tua idea. Valuteremo la tua idea e le tue esigenze e in poco tempo ti presenteremo
                        un chiaro e dettagliato progetto per spingere la tua attività in alto.
                    </p>
                    <Button
                        buttonTextDesktop="Parlaci della tua idea"
                        backgroundColor={backgroundButtonStyle}
                        className="mt-6"
                    />
                </div>
            </div>
            <div className="container grid md:grid-cols-7 md:gap-1 gap-12 grid-cols-1 place-items-center md:items-start">
                {footerSections.map((section, index) => (
                    <div key={index} className={`${sectionClasses[index]}`}>
                        <h6 className="text-white text-[1rem] font-semibold leading-5 lg:mb-5 mb-9">{section.title}</h6>
                        <ul className="list-none space-y-3 pl-0 ml-0">
                            {section.title === 'Blog' ?
                                categories.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleCategoryClick(item.categoria)}
                                        className="block text-[0.83rem] font-medium leading-5 text-white cursor-pointer"
                                    >
                                        {item.categoria}
                                    </li>
                                )) : null}

                            {section.links?.map((link, linkIndex) => {
                                if (link.url) {
                                    return (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.url}
                                                className="block text-[0.83rem] font-medium leading-5 text-white cursor-pointer"
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    );
                                }
                                // Gestisci i casi senza URL
                                return (
                                    <li key={linkIndex} className="text-[0.83rem] font-medium leading-6 text-white">
                                        {link.text}
                                    </li>
                                );
                            })}
                            {!section.links && section.content?.map((item, itemIndex) => {
                                // Altrimenti, usa un frammento di testo in linea
                                return (
                                    <p key={itemIndex} className="text-[0.83rem] font-medium leading-6 text-white">
                                        {item.url ? (
                                            <Link
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white"
                                            >
                                                {item.text}
                                            </Link>
                                        ) : (
                                            item.text
                                        )}
                                    </p>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </footer>
    );
}


