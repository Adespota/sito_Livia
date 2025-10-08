import { useEffect, useRef } from "react";


export const useAutoScroll = (speed = 100) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;

        // Verifichiamo che l'elemento esista e sia un elemento HTML
        if (!(el instanceof HTMLElement)) return;

        const interval = setInterval(() => {
            // Controlla se abbiamo raggiunto la fine dello scroll
            // Se sì, resetta a 0, altrimenti incrementa di 1
            el.scrollTop = el.scrollTop + 1 >= el.scrollHeight - el.clientHeight ? 0 : el.scrollTop + 1;
        }, speed);

        // Funzione di pulizia: interrompe l'intervallo quando il componente si smonta
        return () => clearInterval(interval);
    }, [speed]); // Dipendenza: l'effetto si riesegue solo se 'speed' cambia

    return ref; // Restituisce il ref da collegare all'elemento DOM
};

