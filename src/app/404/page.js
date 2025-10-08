'use client';

import {ChevronRightIcon} from "@heroicons/react/24/solid";
import HeroIcon from "../components/HeroIcons";
import homeIcon from "@heroicons/react/24/outline/esm/HomeIcon";
import phoneIcon from "@heroicons/react/24/outline/esm/PhoneIcon";
import sparkles from "@heroicons/react/24/outline/esm/SparklesIcon";
import questionMarkCircleIcon from "@heroicons/react/24/outline/esm/QuestionMarkCircleIcon";
import Link from "next/link";



const route404 = [
    {
        name: 'Home',
        description: 'Ritorna alla home page',
        href: '/',
        icon: homeIcon,
        iconSecond: ChevronRightIcon
    },
    {
        name: 'Contatti',
        description: 'Trova tutte le informazioni necessarie per contattarmi',
        href: '/contatti',
        icon: phoneIcon,
        iconSecond: ChevronRightIcon
    },
    {
        name: 'FAQ',
        description: 'Risposte alle domande frequenti',
        href: '/faq',
        icon: questionMarkCircleIcon,
        iconSecond: ChevronRightIcon
    },
    {
        name: 'Prova gratis',
        description: 'Prova gratis SeoLO',
        href: '/dashboardAdmin/nuovoArticolo/?preview=true',
        icon: sparkles,
        iconSecond: ChevronRightIcon
    },
];



const list404 = (
    <>
        {route404.map((item) => (
            <div key={item.name} className="flex items-center justify-center text-left group relative gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon className="h-6 w-6 text-my group-hover:text-myColor-default" aria-hidden="true" />
                </div>
                <div className="flex flex-col w-full">
                    <Link href={item.href} className="block font-semibold">
                        {item.name}
                        <span className="absolute inset-0"/>
                    </Link>
                    <p className="mt-1 text-sm font-medium lg:w-2/3 w-full">{item.description} </p>
                </div>
                <div>
                    <HeroIcon icon={item.iconSecond} />
                </div>
            </div>
        ))}
    </>
);



export default function Page404() {
    return (
        <>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <h1 className="font-semibold text-myColor-default">404</h1>
                    <h2 className="text-6xl mt-4 font-bold">Pagina non trovata</h2>
                    <p className="mt-6 leading-7">Mi dispiace, la pagina che stai cercando non è stata trovata</p>
                    <div className="mt-16">
                        {list404}
                    </div>
                </div>
            </main>
        </>
    );
}
