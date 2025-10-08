'use client'
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import InputTextBlog from "./InputTextBlog";
import {useDispatch, useSelector,} from "react-redux";
import {
    selectCategories,
    selectNewCategory,
    selectNewDescriptionOfCategory,
    setCategory,
    resetNewDescription,
    resetNewCategory,
} from "/src/reducer/features/articoloSlice";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {auth, firestore} from "@/app/firebase";
import Button from "../../components/Button";
import {showSnackbar} from "@/reducer/features/snackBarSlice";




export default function AddNewCategory() {
    const dispatch = useDispatch();
    const allCategories =  useSelector(selectCategories);
    const selectedNewCategory = useSelector(selectNewCategory);
    const selectedNewDescription = useSelector(selectNewDescriptionOfCategory);



    const addCategoryAndDescription = useCallback(async () => {
        if (selectedNewCategory && selectedNewDescription) {
            try {
                const collectionRef = collection(firestore, "categorie_oscar", );


                // Aggiungi la categoria con la descrizione
                const newCategoryRef = await addDoc(collectionRef, {
                    categoria: selectedNewCategory,
                    description: selectedNewDescription,
                });

                // Crea l'oggetto della nuova categoria da salvare nello stato
                const newCategory = {
                    id: newCategoryRef.id,
                    categoria: selectedNewCategory,
                    description: selectedNewDescription,
                };
                dispatch(showSnackbar({ message: "Categoria aggiunta con successo", type: "success" }));
                // Aggiorna lo stato con la nuova categoria
                dispatch(setCategory([...allCategories, newCategory]));

                // Resetta i campi
                dispatch(resetNewCategory());
                dispatch(resetNewDescription());
            } catch (error) {
                console.error("Errore durante l'aggiunta della categoria:", error);
            }
        } else {
            console.error("userEmail, selectedNewCategory o selectedNewDescription non è definito");
        }
    }, [selectedNewCategory, selectedNewDescription, dispatch, allCategories]);



    return (
        <div className="rounded-2xl bg-white px-10 py-10 space-y-5 relative">
            <div className="flex md:flex-row flex-col w-full">
                <h6 className="basis-1/4 font-semibold text-[1.2rem]">
                    Aggiungi nuova categoria e descrizione
                </h6>
                <div className="flex flex-col flex-grow space-y-5">
                    <>
                        <InputTextBlog
                            placeholder="Aggiungi categoria"
                            field="newCategory"
                        />
                        <InputTextBlog
                            placeholder="Aggiungi descrizione"
                            field="newDescription"
                        />
                        <div className="flex justify-end">
                            <Button
                                buttonTextDesktop="Aggiungi"
                                onClick={addCategoryAndDescription}
                            />
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}
