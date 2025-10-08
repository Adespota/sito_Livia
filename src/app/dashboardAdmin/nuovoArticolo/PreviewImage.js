import React, {useState, useRef, useEffect} from "react";
import Image from "next/image";
import Button from "../../components/Button";
import { ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import {storage} from "/src/app/firebase";
import {Skeleton} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    resetImagePreview,
    resetImage,
    selectImagePreview,
    selectInitialStateArticolo,
    setFileName,
    setImagePreview,
    setInput
} from "/src/reducer/features/articoloSlice";
import CircularProgressWithTimer from "../../components/CircularProgress";


export default function PreviewImage() {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const articoloState = useSelector(selectInitialStateArticolo);
    const imagePreview = useSelector(selectImagePreview);
    const imageSRC = articoloState.immagine || '/placeholderImage.svg';


    useEffect(() => {
        console.log("imagePreview del redux", imagePreview);
    }, [imagePreview])


    const buttonPreview = () => {
        return new Promise((resolve, reject) => {
            if (fileInputRef.current) {
                fileInputRef.current.addEventListener('change', async (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        setIsLoading(true);

                        // Creare URL temporaneo
                        const imageUrl = URL.createObjectURL(file);
                        dispatch(setInput({ field: "immagine", value: imageUrl }));
                        dispatch(setFileName(file.name)); // Aggiorna il fileName nello stato Redux
                        dispatch(setImagePreview(imageUrl)); // Aggiorna l'anteprima dell'immagine
                        setImagePreview(imageUrl);
                        console.log("Url di anteprima", imageUrl);
                        setIsLoading(false);
                        fileInputRef.current.value = null;
                        resolve();
                    } else {
                        setIsLoading(false);
                        resolve();
                    }
                });
                fileInputRef.current.click();
            }
        });
    };

    // Funzione per rimuovere l'immagine di copertina dal redux
    const removePreview = () => {
        try {
            dispatch(resetImagePreview());
            dispatch(resetImage());
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to remove image', error);
        }
    };

    return (
        <div className="rounded-2xl bg-white px-10 py-10 space-y-5 min-h-[496px]">
            <div className="flex md:flex-row flex-col">
                <div className="w-full inline-flex items-center justify-between">
                    <h6 className="font-semibold text-[1.2rem]">Carica immagine</h6>
                    <div className="flex justify-end space-x-4">
                        <Button
                            buttonTextDesktop="Rimuovi"
                            onClick={removePreview}
                        />
                        <Button
                            buttonTextDesktop="Carica"
                            onClick={buttonPreview}
                        />
                    </div>
                    <input type="file" hidden ref={fileInputRef}/>
                </div>
            </div>
            <div className="flex-grow flex flex-col space-y-5">
                {
                    (imagePreview || imageSRC) &&
                    <div className="flex justify-center">
                        {isLoading ?
                            <CircularProgressWithTimer/> :
                            <div className="relative w-[630px] h-[500px]">
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
        </div>
    );
}
