// utils/calcolaCreditoResiduo.js
export function calcolaCreditoResiduo(dataSottoscrizione, price, durataAbbonamento) {
    // Se manca un parametro, restituisco 0 e 0 giorni trascorsi
    if (!dataSottoscrizione || !durataAbbonamento || !price) {
        return { credito: 0, giorniTrascorsi: 0 };
    }

    const oggi = new Date();

    // Gestione timestamp Firebase o stringa Date
    const inizio = dataSottoscrizione.seconds
        ? new Date(dataSottoscrizione.seconds * 1000)
        : new Date(dataSottoscrizione);

    const giorniTotali = durataAbbonamento === 'Annuale' ? 365 : 30;
    const diffMs = oggi.getTime() - inizio.getTime();
    const giorniTrascorsi = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Se ha già consumato tutto il periodo
    if (giorniTrascorsi >= giorniTotali) {
        return { credito: 0, giorniTrascorsi };
    }

    const giorniResidui = giorniTotali - giorniTrascorsi;
    const credito = Math.round((price / giorniTotali) * giorniResidui);

    return {
        credito,           // credito residuo in centesimi
        giorniTrascorsi    // giorni trascorsi dall'inizio
    };
}
