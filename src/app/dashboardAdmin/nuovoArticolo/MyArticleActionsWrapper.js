'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArticleActions } from '@adespota/my-react-component';
import { backgroundButtonStyle } from '@/styles/constants';
import {firestore} from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as domainLib from '@tuoorg/domain-lib';
import {uploadImageToStorage} from "@/utils/uploadImageToStorage";



// 🔹 Lista dei campi da escludere prima dell’invio
const excludedFields = [
    'newCategory',
    'newDescription',
    'imagePreview',
    'imagePreviewParagraph',
    'documentId',
    'numeroParolePerParagrafo',
    'numeroParoleTotali',
    'validazione',
    'validazione',
    'linkInterniValido',
    'linkEsterniValido',
    'LinkRiferimento',
    'shouldSendToRedux',
    'resetKey',
    'fileNameParagraph',
    'loading',
    'category',
    'dataArticolo',
    'normalizedSlug',
    'article',
    'fileName',
];



export default function MyArticleActionsWrapper() {
    const dispatch = useDispatch();
    const articolo = useSelector((state) => state.articolo);
    const [loading, setLoading] = useState(false);
    const showSnackbar = domainLib.snackbar.showSnackbar;


    // 🔧 Utility per rimuovere i campi esclusi (ricorsiva)
    const removeExcludedFields = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(removeExcludedFields);
        } else if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([key]) => !excludedFields.includes(key))
                    .map(([key, value]) => [key, removeExcludedFields(value)])
            );
        }
        return obj;
    };



    const handleSendArticle = async () => {
        try {
            setLoading(true);

            // 🔹 Rimuovi campi non ammessi
            const cleanArticolo = removeExcludedFields(articolo);

            // 🔹 Crea copia locale da modificare
            let articoloFinale = { ...cleanArticolo };

            // 🔥 Upload immagine solo se è base64
            if (articoloFinale.immagine && articoloFinale.immagine.startsWith("data:image")) {
                const byteCharacters = atob(articoloFinale.immagine.split(",")[1]);
                const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/png" });

                const url = await uploadImageToStorage(blob, "immagini_articoli");
                articoloFinale.immagine = url;
            }

            // 📤 Pubblica su Firestore
            const docRef = await addDoc(collection(firestore, "articoli_pubblicati"), {
                ...articoloFinale,
                createdAt: serverTimestamp(),
            });

            console.log("✅ Articolo pubblicato con ID:", docRef.id);
            dispatch(domainLib.articolo.setDocumentId(docRef.id));
            dispatch(showSnackbar({ message: "Articolo pubblicato con successo!", type: "success" }));
        } catch (error) {
            console.error("❌ Errore durante la pubblicazione:", error);
            dispatch(showSnackbar({ message: "Errore durante la pubblicazione.", type: "error" }));
        } finally {
            setLoading(false);
        }
    };


    // 💾 Salva bozza
    const handleSaveDraft = async () => {
        try {
            setLoading(true);
            const cleanArticolo = removeExcludedFields(articolo);

            const docRef = await addDoc(collection(db, 'articoli_bozze'), {
                ...cleanArticolo,
                createdAt: serverTimestamp(),
                stato: 'bozza',
            });

            console.log('💾 Bozza salvata con ID:', docRef.id);
            dispatch(showSnackbar({ message: 'Bozza salvata con successo!', type: 'info' }));
        } catch (error) {
            console.error('❌ Errore durante il salvataggio:', error);
            dispatch(showSnackbar({ message: 'Errore durante il salvataggio della bozza.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ArticleActions
            onSendArticle={handleSendArticle}
            onSaveDraft={handleSaveDraft}
            isSending={loading}
            backgroundColor={backgroundButtonStyle}
        />
    );
}
