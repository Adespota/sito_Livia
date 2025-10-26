'use client';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as domainLib from '@tuoorg/domain-lib';
import { AddNewCategory } from '@adespota/my-react-component';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from "@/app/firebase";
import {backgroundButtonStyle} from "@/styles/constants";



export default function MyAddNewCategoryWrapper() {
    const dispatch = useDispatch();
    const allCategories = useSelector(s => s?.articles?.category);
    const newCategory = useSelector(s => s?.articolo?.newCategory);
    const newDescription = useSelector(s => s?.articolo?.newDescription);
    const { setCategory, resetNewCategory, resetNewDescription } = domainLib.articolo;
    const showSnackbar = domainLib.snackbar.showSnackbar;
    const azione = domainLib.articolo.setInput;


    // Funzionalità per aggiungere categoria
    const handleAddCategory = useCallback(async () => {
        try {
            const collectionRef = collection(firestore, 'categorie');
            const docRef = await addDoc(collectionRef, {
                categoria: newCategory,
                description: newDescription,
            });

            dispatch(setCategory([...allCategories, { id: docRef.id, categoria: newCategory, description: newDescription }]));
            dispatch(showSnackbar({
                message: 'Categoria aggiunta con successo',
                type: 'success'
            }));
            dispatch(resetNewCategory());
            dispatch(resetNewDescription());
        } catch (e) {
            console.error('Errore durante aggiunta categoria:', e);
            dispatch(showSnackbar({ message: 'Errore durante aggiunta categoria', type: 'error' }));
        }
    }, [newCategory, newDescription, allCategories, dispatch]);



    return (
        <AddNewCategory
            newCategory={newCategory}
            newDescription={newDescription}
            onCategoryChange={val => dispatch(domainLib.articolo.setSelectedNewCategory(val))}
            onDescriptionChange={val => dispatch(azione({ field: 'newDescription', value: val }))}
            onAddCategory={handleAddCategory}
            backgroundColor={backgroundButtonStyle}
        />
    );
}
