import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Converte una stringa LaTeX in una stringa HTML renderizzata da KaTeX.
 *
 * @param {string} latexString La stringa che contiene la formula LaTeX (es. "E=mc^2").
 * @param {boolean} [displayMode=true] Se la formula deve essere renderizzata in modalità display (centrata) o inline.
 * @returns {string} La stringa HTML della formula renderizzata, o un messaggio di errore HTML in caso di problemi.
 */
export const convertiInFormula = (latexString, displayMode = true) => {
    if (!latexString || typeof latexString !== 'string' || latexString.trim() === '') {
        return '<span style="color: #999; font-style: italic;">Nessuna formula LaTeX fornita.</span>';
    }

    try {
        // Chiama l'API di KaTeX per renderizzare la stringa LaTeX in HTML
        const htmlFormula = katex.renderToString(latexString, {
            throwOnError: false, // Importante: visualizza l'errore invece di lanciare un'eccezione
            displayMode: displayMode, // true per equazioni blocco, false per inline
            // Puoi aggiungere altre opzioni KaTeX qui, ad esempio:
            // strict: false, // Per essere meno rigorosi sull'input LaTeX
            // output: 'html', // L'output di default è 'html'
            // trust: true, // Se gestisci input da utenti, fai attenzione a questa opzione!
        });
        return htmlFormula;
    } catch (error) {
        console.error("Errore durante la conversione LaTeX con KaTeX:", error);
        // Restituisci un HTML che indica l'errore, utile per il debug nell'interfaccia utente
        return `<div style="color: red; font-weight: bold;">Errore KaTeX: ${error.message}</div>`;
    }
};
