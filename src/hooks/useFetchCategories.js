"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startCategorySync, stopCategorySync } from '@/services/startCategorySync';

export default function useFetchCategories() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Avvia il servizio una sola volta
        startCategorySync(dispatch);

        // La funzione di cleanup si occuperà di fermare il servizio
        return () => {
            stopCategorySync();
        };
    }, []);

    // L'hook non renderizza nulla, ma avvia il servizio
    return null;
}
