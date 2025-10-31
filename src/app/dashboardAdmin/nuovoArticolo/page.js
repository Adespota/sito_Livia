'use client';

import React, {useState} from "react";
import MyCategoryWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyCategoryWrapper";
import MyTitleAndSubtitleWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyTitleAndSubtitleWrapper";
import MyAddNewCategoryWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyAddNewCategoryWrapper";
import MyIndiceWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyIndiceWrapper";
import MySintesiArticoloWrapper from "@/app/dashboardAdmin/nuovoArticolo/MySintesiArticoloWrapper";
import MyPuntiChiaveWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyPuntiChiaveWrapper";
import AllParagraphs from "@/app/dashboardAdmin/nuovoArticolo/AllParagraphs";
import MyFaqWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyFaqWrapper";
import MySeoDataFormWrapper from "@/app/dashboardAdmin/nuovoArticolo/MySeoDataFormWrapper";
import {ControllerArticle, LoadingModal} from "@adespota/my-react-component";
import {batch, useDispatch} from "react-redux";
import * as domainLib from '@tuoorg/domain-lib';
import {backgroundButtonStyle} from "@/styles/constants";
import MyArticleActionsWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyArticleActionsWrapper";
import MyPreviewImageWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyPreviewImageWrapper";


const authorOptions = [
    'Marketer',
    'Seo Specialist',
    'Neuromarketing',
    'Esperto di marketing'
]


export default function Page() {
    const dispatch = useDispatch();
    const [geminiLoading, setGeminiLoading] = useState(false);

    const {
        deleteAllParagraphs,
        resetAll,
        addParagraph,
        resetImagePreview,
        resetImage,
        updateParolaChiaveFromGemini,
        updateTitoloSeoFromGemini,
        updateSlugFromGemini,
        updateMetaDescriptionFromGemini,
        updateTitleFromGemini,
        updateSubtitleFromGemini,
        updateSintesiFromGemini,
        updatePuntiChiaveFromGemini,
        updateFaqFromGemini,
        updateTitleParagraph,
        updateContentParagraph,
        updateIndiceFromGemini,
    } = domainLib.articolo;

    const [generatedIdea, setGeneratedIdea] = useState("");




    // Genera l'idea per l'articolo
    async function generateIdea({ idea, style, author, targetAudience }) {
        console.log('✨ Dati passati all API per generare idea articolo:', idea, style, author, targetAudience)
        setGeminiLoading(true);

        try {
            const response = await fetch("https://www.seolo.net/api/generatePrompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userPrompt: idea, // Idea o tematica inziale
                    stylePrompt: style, // Stile che si desidera
                    authorPerson: author, // Chi scrive l'articolo
                    targetAudience: targetAudience // Pubblico target
                }),
            });

            if (!response.ok) throw new Error(`Errore API: ${response.statusText}`);

            const data = await response.json();
            console.log("Prompt generato dall'API:", data);

            // ✅ aggiorna il valore nello stato del parent
            setGeneratedIdea(data.prompt);

        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
            alert("Errore nella generazione dell’idea.");
        } finally {
            setGeminiLoading(false);
        }
    }



    // sendToGemini: wrapper HTTP su https://seolo.net/api/gemini
    // espone un’unica API per inviare un prompt a Gemini
    // e ricevere in risposta un oggetto JSON strutturato
    async function sendToGemini({ prompt, numParagrafi, articleStyle, targetAudience, author }) {
        setGeminiLoading(true);

        // 🔄 Reset stato Redux prima della generazione
        dispatch(deleteAllParagraphs());
        dispatch(resetAll());
        dispatch(addParagraph());
        dispatch(resetImagePreview());
        dispatch(resetImage());

        try {
            // 🔥 Chiamata API
            const res = await fetch("https://www.seolo.net/api/geminiGenerateArticle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    numParagrafi,
                    articleStyle,
                    sintesi: true,
                    faq: true,
                    targetAudience,
                    author,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }

            const data = await res.json();

            // Aggiorna Redux con i dati ricevuti da Gemini
            batch(() => {
                // SEO
                if (data.parolaChiave) dispatch(updateParolaChiaveFromGemini(data.parolaChiave));
                if (data.titoloSeo) dispatch(updateTitoloSeoFromGemini(data.titoloSeo));
                if (data.slug) dispatch(updateSlugFromGemini(data.slug));
                if (data.metaDescription) dispatch(updateMetaDescriptionFromGemini(data.metaDescription));

                // Titolo + sottotitolo + sintesi + punti chiave
                if (data.titolo) dispatch(updateTitleFromGemini(data.titolo));
                if (data.sottotitolo) dispatch(updateSubtitleFromGemini(data.sottotitolo));
                if (data.sintesi) dispatch(updateSintesiFromGemini(data.sintesi));
                if (data.puntiChiave) dispatch(updatePuntiChiaveFromGemini(data.puntiChiave));

                // FAQ
                if (data.faq) dispatch(updateFaqFromGemini(data.faq));

                // Paragrafi dinamici
                if (data.paragrafi?.length > 0) {
                    data.paragrafi.forEach((p, i) => {
                        if (i > 0) dispatch(addParagraph());
                        dispatch(updateTitleParagraph({ index: i, newTitle: p.titolo }));
                        dispatch(updateContentParagraph({ index: i, newParagraph: p.contenuto }));
                    });
                    dispatch(updateIndiceFromGemini());
                }
            });

            return data;
        } catch (error) {
            console.error("Errore durante la generazione con Gemini:", error);
            alert("Errore durante la generazione dell’articolo. Riprova.");
        } finally {
            setGeminiLoading(false);
        }
    }



    return (
        <div className="flex flex-col space-y-3">
            <h6 className="mb-8">Nuovo articolo</h6>
            <LoadingModal isOpen={geminiLoading} message="Attendi...sto generando..."  />
            <MyArticleActionsWrapper />
            <ControllerArticle
                authorOptions={authorOptions}
                geminiLoading={geminiLoading}
                onCleanData={() => dispatch(resetAll())}
                onGenerateIdea={generateIdea}
                onGenerateArticle={(params) => sendToGemini(params)}  // ✅ invia oggetto completo
                backgroundColor={backgroundButtonStyle}
                generatedIdea={generatedIdea}
            />
            <MyCategoryWrapper />
            <MyTitleAndSubtitleWrapper />
            <MyAddNewCategoryWrapper />
            <MyIndiceWrapper />
            <MySintesiArticoloWrapper />
            <MyPuntiChiaveWrapper />
            <MyPreviewImageWrapper />
            <AllParagraphs />
            <MyFaqWrapper />
            <MySeoDataFormWrapper />
        </div>
    );
}



