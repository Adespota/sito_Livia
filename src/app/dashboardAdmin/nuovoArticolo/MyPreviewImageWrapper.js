'use client';

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PreviewImage } from "@adespota/my-react-component";
import { backgroundButtonStyle } from "@/styles/constants";
import * as domainLib from '@tuoorg/domain-lib';



export default function MyPreviewImageWrapper() {
    const dispatch = useDispatch();
    const articolo = useSelector((state) => state.articolo);
    const imageSrc = articolo.immagine || articolo.imagePreview;
    const [loading, setLoading] = useState(false);
    const showSnackbar = domainLib.snackbar.showSnackbar;
    const setInput = domainLib.articolo.setInput;
    const setFileName = domainLib.articolo.setFileName;
    const setImagePreview = domainLib.articolo.setImagePreview;
    const resetImagePreview = domainLib.articolo.resetImagePreview;
    const resetImage = domainLib.articolo.resetImage;
    const resetFileName = domainLib.articolo.resetFileName;



    /** 🤖 Genera immagine con IA */
    const handleGenerateImage = async (prompt) => {
        setLoading(true);
        try {
            const res = await fetch("https://www.seolo.net/api/geminiGenerateImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const { images = [], error } = await res.json();
            if (error) throw new Error(error);
            if (!images.length) throw new Error("Nessuna immagine generata");

            const uri = `data:image/png;base64,${images[0]}`;
            dispatch(setImagePreview(uri));
            dispatch(setInput({ field: "immagine", value: uri }));
            dispatch(setFileName("generated.png"));
        } catch (err) {
            console.error("Errore IA:", err);
        } finally {
            setLoading(false);
        }
    };

    /** 📁 Upload manuale */
    const handleUploadImage = ({ file, imageUrl }) => {
        dispatch(setInput({ field: "immagine", value: imageUrl }));
        dispatch(setFileName(file.name));
        dispatch(setImagePreview(imageUrl));
    };

    /** 🗑️ Rimuovi immagine */
    const handleRemoveImage = () => {
        dispatch(resetImagePreview());
        dispatch(resetImage());
        dispatch(resetFileName());
    };

    return (
        <PreviewImage
            imageSrc={imageSrc}
            onGenerateImage={handleGenerateImage}
            onUploadImage={handleUploadImage}
            onRemoveImage={handleRemoveImage}
            isLoading={loading}
            backgroundColor={backgroundButtonStyle}
        />
    );
}
