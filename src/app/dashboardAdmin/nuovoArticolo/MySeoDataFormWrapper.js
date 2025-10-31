import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as domainLib from "@tuoorg/domain-lib";
import { SeoDataForm } from "@adespota/my-react-component";


export default function MySeoDataFormWrapper() {
    const dispatch = useDispatch();
    const articolo = useSelector((s) => s?.articolo || {});
    const setInput = domainLib.articolo.setInput;

    return (
        <SeoDataForm
            value={{
                parolaChiave: articolo.parolaChiave,
                titoloSeo: articolo.titoloSeo,
                slug: articolo.slug,
                metaDescription: articolo.metaDescription,
            }}
            onChange={(payload) => dispatch(setInput(payload))}
        />
    );
}
