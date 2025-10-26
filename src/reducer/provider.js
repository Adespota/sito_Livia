"use client";

import {store} from './store';
import {Provider} from "react-redux";
import {EntryPointData} from "@/app/EntryPointData";
import {useEffect} from "react";
import {startArticlesSync, stopArticlesSync} from "@/services/startArticlesSync";


export function ReduxProvider({ children }){

    useEffect(() => {
        console.log("🟢 [PROVIDER] Avvio del servizio di sincronizzazione...");
        // Avvia il servizio di sincronizzazione una sola volta
        startArticlesSync();

        // La funzione di cleanup si occuperà di fermare il servizio
        return () => {
            console.log("🛑 [PROVIDER] Pulizia del servizio di sincronizzazione...");
            stopArticlesSync();
        };
    }, []);


    return (
        <Provider store={store}>
            <EntryPointData />
            {children}
        </Provider>
    )
}
