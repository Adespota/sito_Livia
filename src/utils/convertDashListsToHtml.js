export const convertDashListsToHtml = (text) => {
    if (typeof text !== 'string') {
        console.warn("Input non valido per convertDashListsToHtml. Attesa una stringa, ricevuto:", text);
        return text;
    }

    // STEP 1: Normalizzazione aggressiva del testo di input.
    // Questo è il passaggio FONDAMENTALE per gestire varianti e "rumore" nel testo.
    let normalizedText = text
        // Trasforma ogni occorrenza di "- [spazi] [newline] [spazi]" in un semplice " - "
        // Questo connette il trattino di chiusura alla voce se c'è un newline di mezzo
        .replace(/-\s*[\r\n]+\s*/g, ' - ')
        // Sostituisce ogni tipo di interruzione di riga con un singolo spazio
        .replace(/(\r\n|\n|\r)/g, ' ')
        // Riduci spazi multipli (anche tra parole) a un singolo spazio
        .replace(/\s+/g, ' ')
        // Rimuovi spazi extra all'inizio/fine del testo
        .trim();

    // REGEX super-robusta per catturare il pattern `- contenuto -`
    // Dettaglio della Regex:
    // `(?:^|\s)`: Trattino iniziale preceduto dall'inizio della stringa (`^`) o da uno spazio bianco (`\s`).
    //             Questo previene match come "pre-chirurgia".
    // `-+`: Corrisponde a uno o più trattini (es. `-`, `--`, `---`).
    // `\s*`: Zero o più spazi dopo il trattino iniziale.
    // `([\s\S]+?)`: **GRUPPO DI CATTURA per il contenuto della voce di lista.**
    //               `[\s\S]` matchta qualsiasi carattere (include punteggiatura finale della voce).
    //               `+?` lo rende non-greedy, essenziale per fermarsi al primo trattino di chiusura valido.
    // `\s*`: Zero o più spazi prima del trattino finale.
    // `-+`: Uno o più trattini finali.
    // `(?=[\s.,;!?:<>]|-|$)`: **Positive Lookahead (non catturante)**. Assicura che il trattino finale sia seguito da:
    //    `\s`: uno spazio
    //    `[.,;!?:<>]`: un carattere di punteggiatura comune (aggiunto `>` per fine tag HTML)
    //    `-`: un altro trattino (per voci consecutive, es. `-uno- -due-`)
    //    `$`: la fine della stringa
    // `g`: Flag globale, trova tutte le occorrenze.
    const dashItemPattern = /(?:^|\s)-+\s*([\s\S]+?)\s*-+(?=[\s.,;!?:<>]|-|$)/g;

    let resultHtml = [];
    let lastIndex = 0;
    let currentListItems = [];
    let match;

    // STEP 2: Esegui la regex sul testo normalizzato
    while ((match = dashItemPattern.exec(normalizedText)) !== null) {
        // `match[0]` è l'intera stringa che ha trovato la regex (es. " - Il tuo elemento -").
        // `match[1]` è il contenuto effettivo della voce di lista.

        // Determina l'indice di inizio del testo normale che precede la lista.
        // Se il match non inizia all'indice 0, significa che c'è un carattere (lo spazio) prima del trattino.
        const effectiveMatchStartIndex = match.index + (match[0].startsWith(' ') ? 1 : 0);

        // Gestisci il testo normale che precede l'elemento listato corrente
        if (effectiveMatchStartIndex > lastIndex) {
            const precedingText = normalizedText.substring(lastIndex, effectiveMatchStartIndex).trim();
            if (precedingText) {
                // Se c'erano voci di lista aperte dalla corrispondenza precedente, chiudile prima di aggiungere il testo normale
                if (currentListItems.length > 0) {
                    resultHtml.push(`<ul>${currentListItems.join('')}</ul>`);
                    currentListItems = []; // Resetta la lista corrente
                }
                // Avvolgi il testo normale in un paragrafo <p>
                resultHtml.push(`<p>${precedingText}</p>`);
            }
        }

        // Aggiungi l'attuale voce di lista come <li>
        const itemContent = match[1].trim(); // `match[1]` è il contenuto della lista
        currentListItems.push(`<li>${itemContent}</li>`);

        // Aggiorna `lastIndex` per il prossimo ciclo. Deve puntare alla fine del match corrente.
        lastIndex = match.index + match[0].length;
    }

    // STEP 3: Gestisci i blocchi HTML rimanenti (dopo l'ultimo match o se non ci sono match)

    // Se ci sono voci di lista rimaste in `currentListItems` alla fine del testo, avvolgile in un <ul>
    if (currentListItems.length > 0) {
        resultHtml.push(`<ul>${currentListItems.join('')}</ul>`);
    }

    // Gestisci qualsiasi testo rimanente dopo l'ultima corrispondenza di lista
    if (lastIndex < normalizedText.length) {
        const remainingText = normalizedText.substring(lastIndex).trim();
        if (remainingText) {
            resultHtml.push(`<p>${remainingText}</p>`);
        }
    }

    // Se non è stato trovato nessun elemento di lista e c'è del testo, avvolgilo interamente in un paragrafo
    if (resultHtml.length === 0 && normalizedText.trim().length > 0) {
        return `<p>${normalizedText.trim()}</p>`;
    }

    const finalResult = resultHtml.join('');
    // Pulisci eventuali tag <p>, <ul> o <ol> vuoti
    return finalResult.replace(/<p>\s*<\/p>/g, '')
        .replace(/<ul>\s*<\/ul>/g, '')
        .replace(/<ol>\s*<\/ol>/g, '');
};
