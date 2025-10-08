'use client';

import React, {useState} from "react";
import {MinusIcon, PlusIcon} from "@heroicons/react/24/outline";



const FaqItem = ({ faq }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div className="flex flex-col rounded-xl bg-white px-5 py-5 space-y-5">
                <div className="">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{faq.question}</p>
                        <div>
                            {open
                                ? <MinusIcon
                                    onClick={handleClose}
                                    className="text-myColor-default ml-2 h-6 w-6"/>
                                : <PlusIcon
                                    onClick={handleClick}
                                    className="text-myColor-default ml-2 h-6 w-6"/>
                            }
                        </div>
                    </div>
                </div>
                {open && <p>{faq.answer}</p>}
            </div>
        </>
    );
}


export default function FaqComponent({ faqs = [], titleAndDescription = false }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-12 sm:gap-4 gap-0 mt-6 sm:mt-2 mx-0 sm:mx-28">
            {/* Sezione titolo e descrizione, mostrata solo se titleAndDescription è true */}
            {titleAndDescription && (
                <div className="sm:col-start-3 sm:col-span-3 sm:px-0 px-[18px]">
                    <h2 className="font-bold text-3xl">FAQ</h2>
                    <p>In questa sezione troverai le risposte alle domande più frequenti.</p>
                </div>
            )}

            {/* Elenco delle FAQ con classi condizionali */}
            <div className={titleAndDescription
                ? "col-span-1 sm:col-start-6 sm:col-span-6 p-5 space-y-4 mb-10"
                : "col-span-12 p-5 space-y-4 mb-10"
            }>
                {faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)}
            </div>
        </div>
    );
}

