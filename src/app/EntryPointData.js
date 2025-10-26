'use client';

import useFetchCategories from "@/hooks/useFetchCategories";



// Questo componente si occupa solo di chiamare l'hook
// e non renderizza nulla. Lo uso per passare tutti gli hook che carica una sola vola all'avvio dell'app. Alcuni
// di questi hook sincronizzano i dati con IndexedDB
export function EntryPointData() {
    useFetchCategories();


    // Restituisce null per non interferire con il layout dell'app
    return null;
}
