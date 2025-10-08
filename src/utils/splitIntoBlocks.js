
import {convertiInFormula} from "@/app/dashboardAdmin/nuovoArticolo/convertiInFormula";

/**
 * Suddivide un blocco HTML in paragrafi più brevi, preservando i tag HTML inline e rendendo le formule LaTeX.
 * 1) Inietta un placeholder unico (“__SPLIT__”) dopo ogni punto/esclamativo/interrogativo
 * seguito da Maiuscola, escludendo abbreviazioni e singole iniziali.
 * 2) Splitta su quel placeholder per ottenere un array di stringhe HTML.
 * 3) Per ogni stringa nell'array, individua e converte le formule LaTeX ($...$ e $$...$$) in HTML renderizzato.
 *
 * @param {string} htmlString — stringa HTML di input che potrebbe contenere formule LaTeX
 * @returns {string[]} — array di “blocchi” HTML già processati con le formule renderizzate
 */
export function splitIntoBlocks(htmlString) {
    const PLACEHOLDER = '__SPLIT__';

    // 1) inserisco il placeholder solo dopo frasi “vere”
    const withPlaceholders = htmlString.replace(
        /(?<!(?:\b[A-Z]|\bDr|\bMr|\bMrs|\bMs|\bProf|\bIng|\bDott|\bSig(?:\.|ra)?|\bCap|\bVol|\bed|\d))([.!])\s+(?=[A-ZÀ-Ö])/g,
        `$1${PLACEHOLDER}`
    );

    // 2) Splittiamo su placeholder per ottenere i blocchi iniziali
    const initialBlocks = withPlaceholders
        .split(PLACEHOLDER)
        .map(s => s.trim())
        .filter(Boolean);

    // --- 3) NUOVA LOGICA: Processa ogni blocco per le formule LaTeX ---
    return initialBlocks.map(blockHtml => {
        let currentBlock = blockHtml;

        // Processa formule DISPLAY MODE (es. $$...$$)
        // Cerca stringhe che iniziano con '$$', poi qualsiasi carattere non-greedy (anche newline), e finiscono con '$$'.
        const displayRegex = /\$\$([\s\S]*?)\$\$/gs;
        currentBlock = currentBlock.replace(displayRegex, (match, formulaContent) => {
            try {
                const trimmedFormulaContent = formulaContent.trim();
                return convertiInFormula(trimmedFormulaContent, true); // `true` per display mode
            } catch (e) {
                console.error("Errore nel rendering di formula display:", formulaContent, e);
                return match; // Ritorna il testo originale se c'è un errore
            }
        });

        // Processa formule INLINE (es. $...$)
        // Cerca '$', poi caratteri non-greedy, e finisce con '$'.
        // I lookbehind/lookahead negativi (?<!\$) e (?!\$) evitano che siano parte di '$$'.
        // (?![\\s$]) assicura che non sia un dollaro seguito da spazio o un altro dollaro (evita $ $)
        const inlineRegex = /(?<!\$)\$(?![\s$])(.*?)(?<![\s\$])\$(?!\$)/g;
        currentBlock = currentBlock.replace(inlineRegex, (match, formulaContent) => {
            try {
                const trimmedFormulaContent = formulaContent.trim();
                return convertiInFormula(trimmedFormulaContent, false); // `false` per inline mode
            } catch (e) {
                console.error("Errore nel rendering di formula inline:", formulaContent, e);
                return match; // Ritorna il testo originale se c'è un errore
            }
        });

        return currentBlock;
    }); // Restituisce l'array di blocchi già processati con le formule
}
