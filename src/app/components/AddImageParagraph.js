import React, {useState, useRef, useEffect} from "react";
import Image from "next/image";

import { ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import {useDispatch, useSelector} from "react-redux";
import {
    selectInitialStateArticolo,
    setFileName,
    setInput,
    selectImagePreviewParagraph,
    setImagePreviewParagraph,
    resetImagePreviewParagraph,
    setFileNameImageParagraph,
    setInputPath,
    resetImageInParagraph,
} from "/src/reducer/features/articoloSlice";
import CircularProgressWithTimer from "./CircularProgress";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";


// Questo componente permette di aggiungere l'immagine al paragrafo
export default function AddImageParagraph({index}) {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const articoloState = useSelector(selectInitialStateArticolo);
    const imagePreview = useSelector(selectImagePreviewParagraph(index));
    const imageSRC = articoloState.paragrafi[index]?.immagine || '/placeholderImage.svg';
    const currentImagePreviewParagraph = articoloState.paragrafi?.[index]?.imagePreviewParagraph;


    useEffect(() => {
        let currentImagePreviewParagraph = articoloState.paragrafi?.[index]?.imagePreviewParagraph;
        console.log("imagePreview del redux", currentImagePreviewParagraph);
    }, [currentImagePreviewParagraph, index]);


    const buttonPreview = () => {
        return new Promise((resolve, reject) => {
            if (fileInputRef.current) {
                fileInputRef.current.addEventListener('change', async (event) => {
                    const file = event.target.files[0];
                    if (file) { // Controlla se è stato selezionato un file
                        setIsLoading(true); // Imposta lo stato di caricamento

                        // Crea un URL temporaneo per il file selezionato
                        const imageUrl = URL.createObjectURL(file);
                        setIsLoading(false);
                        console.log('URL dell\'immagine:', imageUrl);
                        console.log('Indice:', index);

                        // Controlla se l'array dei paragrafi è stato inizializzato e se l'indice è valido
                        if (articoloState.paragrafi && articoloState.paragrafi.length > index) {
                            console.log('Prima di setInputPath:', articoloState.paragrafi[index]);

                            // Aggiorna lo stato con i nuovi dati del file immagine
                            dispatch(setInputPath({path: `paragrafi[${index}].immagine`, value: imageUrl}));
                            dispatch(setFileNameImageParagraph({index: index, value: file.name}));
                            dispatch(setImagePreviewParagraph({index: index, value: imageUrl}));
                        }

                        setIsLoading(false); // Resetta lo stato di caricamento
                        fileInputRef.current.value = null; // Resetta il valore del riferimento del file input
                    } else {
                        setIsLoading(false); // Se non è stato selezionato alcun file, resetta lo stato di caricamento
                    }
                });
                fileInputRef.current.click(); // Attiva il click sul file input
            }
        });
    }


    const removePreview = () => {
        try {
            console.log(`Removing preview for paragraph at index ${index}`);
            dispatch(resetImagePreviewParagraph(index));
            dispatch(resetImageInParagraph(index));
        } catch (error) {
            console.error('Failed to remove image', error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="rounded-2xl bg-white space-y-5">
            <div className="flex flex-col py-5 items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex justify-center">
                        {
                            (imagePreview || imageSRC) &&
                            <div className="flex justify-center">
                                {isLoading ?
                                    <CircularProgressWithTimer/> :
                                    <div className="relative w-[300px] h-[150px]">
                                        <Image
                                            src={imagePreview || imageSRC}
                                            alt=""
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-2xl"
                                            sizes="(max-width: 1260px) 50vw, 630px"
                                            unoptimized={true}
                                        />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                <div className="flex flex-col items-center justify-center space-y-4 mt-2">
                    <h6 className="font-semibold text-[1.2rem]">Carica immagine del paragrafo</h6>
                    <div className="inline-flex space-x-3 mt-3">
                        <Button
                            buttonTextDesktop="Rimuovi"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            onClick={removePreview}
                        />
                        <Button
                            buttonTextDesktop="Carica"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            onClick={buttonPreview}
                        />
                    </div>
                    <input type="file" hidden ref={fileInputRef}/>
                </div>
            </div>
        </div>
    );
}
