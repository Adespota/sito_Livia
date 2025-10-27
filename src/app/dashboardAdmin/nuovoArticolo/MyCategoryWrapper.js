'use client';

import React, {useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import * as domainLib from '@tuoorg/domain-lib';
import {Categoria} from "@adespota/my-react-component";
import { deleteDoc, doc,} from "firebase/firestore";
import { firestore } from "@/app/firebase";




export default function MyCategoryWrapper() {
    const dispatch = useDispatch();
    //const firestore = firebase.firestore;




    // Dati da passare a Categoria
    const allCategories = useSelector(s => s?.articles?.category) || [];
    const selectedCategory = useSelector(s => s?.articolo?.categoria) || " ";
    const azione = domainLib.setSelectedCategory;
    const azioneSnackbar = domainLib.snackbar.showSnackbar;
    //console.log("setSelectedCategory in domainLib →", domainLib.setSelectedCategory);




    const handleSelectCategoria = useCallback((value) => {
        dispatch(azione(value));
    }, [dispatch, azione]);



    const handleDelete = async (id) => {
        const docRef = doc(firestore, 'categorie',id);
        try {
            await deleteDoc(docRef);
            dispatch(azioneSnackbar({
                message: "Categoria eliminata con successo",
                type: "success"
            }));

            console.log("Categoria eliminata con successo!");
        } catch (e) {
            console.error("Errore durante la rimozione della categoria: ", e);
        }
    };



    return (
        <>
            <Categoria
                selectedCategory={selectedCategory}
                allCategories={allCategories}
                onCategorySelect={handleSelectCategoria}
                handleDelete={handleDelete}
            />
        </>

    );
}
