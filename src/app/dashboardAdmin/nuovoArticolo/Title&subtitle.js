import React from "react";
import InputTextBlog from "./InputTextBlog";
import {selectValidazione} from "@/reducer/features/articoloSlice";
import {useSelector} from "react-redux";
import InformationSEO from "@/app/components/InformationSEO";


export default function TitleAndSubtitle() {
    const validazione = useSelector(selectValidazione);

    return (
        <div className="rounded-2xl bg-white px-5 py-5 space-y-5">
            <div className="flex w-full flex-col md:flex-row">
                <p className="md:w-1/4 w-full flex-shrink-0 font-semibold text-[0.95rem] md:pb-0 pb-4">Titolo e sottotitolo</p>
                <div className="flex flex-col flex-grow space-y-5">
                    <InputTextBlog
                        placeholder="Titolo"
                        field="titolo"
                        isValid={validazione.titoloValido}
                    />
                    <InputTextBlog
                        placeholder="Sottotitolo"
                        field="sottotitolo"
                        isValid={validazione.sottotitoloValido}
                    />
                </div>
            </div>
        </div>
    );
}
