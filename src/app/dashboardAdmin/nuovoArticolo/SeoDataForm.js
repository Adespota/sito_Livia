import React from "react";
import InputTextBlog from "./InputTextBlog";
import {useSelector} from "react-redux";
import {selectValidazione} from "@/reducer/features/articoloSlice";
import InformationSEO from "@/app/components/InformationSEO";



export default function SeoDataForm() {
    const validazione = useSelector(selectValidazione);


    return (
        <div className="rounded-2xl bg-white px-5 py-5 space-y-7">
            <div className="flex w-full md:flex-row flex-col">
                <p className="w-1/4 flex-shrink-0 font-semibold text-[0.95rem] md:pb-0 pb-4">Dati Seo</p>
                <div className="flex flex-col flex-grow space-y-5">
                    <InputTextBlog
                        placeholder="Parola chiave"
                        field="parolaChiave"
                        isValid={validazione.parolaChiaveValida}
                    />
                    <InputTextBlog
                        placeholder="Titolo SEO"
                        field="titoloSeo"
                        isValid={validazione.titoloSeoValido}
                    />
                    <InputTextBlog
                        placeholder="Slug"
                        field="slug"
                        isValid={validazione.slugValido}
                    />
                    <InputTextBlog
                        placeholder="Meta description"
                        field="metaDescription"
                        isValid={validazione.metaDescriptionValida}
                    />
                </div>
            </div>
        </div>
    );
}
