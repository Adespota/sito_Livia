'use client';

import NavBar from "@/app/components/navBar/NavBar";
import { Switch } from '@headlessui/react';
import classNames from "/src/utils/classNames";
import { useState } from "react";
import CardPrice from "@/app/prices/CardPrice";
import Footer from "@/app/components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {setPlan} from "@/reducer/features/carrelloSlice";



/*
export const metadata = {
    title: 'Prezzi SEOLO - Scopri i Nostri Piani e Tariffe',
    description:
        'Consulta la nostra pagina prezzi per trovare il piano più adatto alle tue esigenze. Approfitta di tariffe competitive e soluzioni su misura per ottimizzare il tuo sito con SEOLO.',
    author: 'Team SEOLO',
    keywords:
        'prezzi, tariffe, piani SEO, abbonamenti SEO, costi software SEO, ottimizzazione sito, SEO avanzato',
    openGraph: {
        title: 'Prezzi SEOLO - Piani e Tariffe per il Tuo Successo Online',
        description:
            'Scopri le diverse opzioni di abbonamento per il nostro software SEO. Investi nella crescita del tuo sito con i piani e le tariffe pensati per ogni esigenza.',
        canonical: 'https://www.seolo.net/prices',
        type: 'website',
        site_name: 'SEOLO',
        images: [
            {
                url: '',
                alt: '',
            },
        ],
    },
    canonical: 'https://www.seolo.net/prices',
}

 */




export default function Prezzi() {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.carrello.plan);

    const handleSwitchChange = (value) => {
        dispatch(setPlan(value));
    };


    return (
        <>
            {/*
             <WorkInProgress />
             */}
            <NavBar />
            <div className="flex flex-col sm:mt-4 mt-5 w-full justify-center items-center">
                <div className="mx-4 sm:mt-0 mt-10 mb-5">
                    <div className="flex flex-col items-center justify-center w-full select-none">
                        <p className="font-bold text-sm text-center ">Piani e prezzi</p>
                        <h2 className="text-3xl text-center">Nessun limite alla tua crescita online</h2>
                        <p className="max-w-2xl text-sm mt-6 text-center">
                            Scegli il tuo piano e porta i tuoi contenuti al massimo del loro potenziale. Aumenta visibilità, traffico e successo online con strumenti SEO avanzati sempre
                            a tua disposizione
                        </p>
                    </div>
                </div>
                <div className="flex items-center mt-4 sm:mb-5 mb-0">
                    <span className="mr-2">Mensile</span>
                    <Switch
                        checked={plan}
                        onChange={handleSwitchChange}
                        className={classNames(
                            plan ? 'bg-myColor-default' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 items-center rounded-full'
                        )}
                    >
                        <span className="sr-only">Accetto termini e condizioni</span>
                        <span
                            aria-hidden="true"
                            className={classNames(
                                plan ? 'translate-x-6' : 'translate-x-1',
                                'inline-block h-4 w-4 transform bg-white rounded-full transition-transform'
                            )}
                        />
                    </Switch>
                   <span className="ml-2">Annuale (- 15%)</span>
                </div>
                <div className="mb-40 w-full">
                    <CardPrice isAnnual={plan}/>
                </div>
            </div>
            <Footer/>
        </>
    );
}
