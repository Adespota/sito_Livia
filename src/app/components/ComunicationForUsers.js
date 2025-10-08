import React from 'react';
import { Divider, Chip } from '@mui/material';


const features = [
    { label: 'Arrivata', color: 'success', text: 'Live chat con IA' },
    { label: 'Arrivata', color: 'success', text: 'Esporta il tuo articolo in un clic' },
    { label: 'In arrivo', color: 'warning', text: 'Scrivi con colleghi e amici il tuo articolo' },
    { label: 'In arrivo', color: 'warning', text: 'AI RAG' },
];


export default function ComunicationForUsers () {
    return (
        <div className="flex-col h-full w-full rounded-2xl bg-white px-5 py-5">
            <div className="flex md:flex-row flex-col w-full">
                <div className="flex flex-col space-y-4 flex-grow">
                    <p className="font-semibold text-[0.8rem]">Tante nuove funzioni per te, e altre in arrivo</p>
                    <div className="w-full">
                        <Divider />
                    </div>
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="inline-flex w-full items-center space-x-2">
                                <div className="mt-0.5">
                                    <Chip
                                        color={feature.color}
                                        label={feature.label}
                                        size="small"
                                        sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </div>
                                <p>{feature.text}</p>
                            </div>
                        ))}
                        <Divider/>
                        <p className="font-semibold text-[0.8rem]">Hai suggerimenti? Proponi una nuova funzionalità</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

