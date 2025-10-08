import React from 'react';
import { CompositeDecorator } from 'draft-js';
import { convertiInFormula } from './convertiInFormula';

export const LatexMathSpan = (props) => {
    const raw = props.decoratedText;
    let formula = raw, display = false;

    if (raw.startsWith('$$') && raw.endsWith('$$') && raw.length > 4) {
        formula = raw.slice(2, -2);
        display = true;
    } else if (raw.startsWith('$') && raw.endsWith('$') && raw.length > 2) {
        formula = raw.slice(1, -1);
    } else {
        return <span>{raw}</span>;
    }

    const html = convertiInFormula(formula, display);
    return (
        <span
            className="latex-formula-rendered"
            style={{
                backgroundColor: display ? '#e0f2f7' : '#f0f8ff',
                border: display ? '1px solid #a7d9ed' : '1px solid #d0e0ff',
                padding: display ? '30px' : '2px 4px',
                borderRadius: '3px',
                display: display ? 'block' : 'inline-block',
                margin: display ? '10px 0' : '0',
                textAlign: display ? 'center' : 'inherit',
                overflowX: 'auto',
                overflowY: 'auto',
                userSelect: 'text',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

// Nel tuo file `latexMathDecorator.js`

export function findLatexMath(contentBlock, callback) {
    const text = contentBlock.getText();
    console.log("DEBUG: --- NUOVO BLOCCO ---");
    console.log("DEBUG: Testo completo del blocco (raw):", text);
    console.log("DEBUG: Testo completo (codici caratteri):", Array.from(text).map(char => `${char}(${char.charCodeAt(0)})`).join(' '));

    // display: $$...$$
    // Questa sembra funzionare bene e non ha bisogno di modifiche per ora.
    const displayRE = /\$\$([\s\S]+?)\$\$/g;
    let m;
    while ((m = displayRE.exec(text)) !== null) {
        console.log("DEBUG: MATCH DISPLAY - Completo:", m[0], "Contenuto:", m[1], "Indice Inizio:", m.index, "Indice Fine:", m.index + m[0].length);
        console.log("DEBUG: Contenuto Display (codici caratteri):", Array.from(m[1]).map(char => `${char}(${char.charCodeAt(0)})`).join(' '));
        callback(m.index, m.index + m[0].length);
    }

    // inline: $...$ (ma non $$)
    // QUESTA È LA MODIFICA CHIAVE
    // Cerca '$' seguito da qualsiasi cosa (non avidamente) fino a un altro '$'
    // E si assicura che NON sia preceduto o seguito da un altro '$' (per evitare i doppi dollari)
    // Nota: rimuove la necessità di controllare ^|[^$] all'inizio della formula
    const inlineRE = /(?<!\$)\$([\s\S]+?)\$(?!\$)/g;
    // Spiegazione:
    // (?<!\$) : Lookbehind negativo: assicura che il '$' non sia preceduto da un altro '$'.
    // \$      : Il '$' di apertura.
    // ([\s\S]+?): Il contenuto della formula (qualsiasi carattere, non avidamente, almeno uno).
    // \$      : Il '$' di chiusura.
    // (?!\$)  : Lookahead negativo: assicura che il '$' non sia seguito da un altro '$'.

    let n;
    while ((n = inlineRE.exec(text)) !== null) {
        // Gli indici sono semplici perché non abbiamo il gruppo di prefisso
        const start = n.index;
        const end = n.index + n[0].length;
        console.log("DEBUG: MATCH INLINE (NEW REGEX) - Completo:", n[0], "Contenuto:", n[1], "Inizio Calcolato:", start, "Fine Calcolata:", end);
        console.log("DEBUG: Contenuto Inline (codici caratteri):", Array.from(n[1]).map(char => `${char}(${char.charCodeAt(0)})`).join(' '));
        callback(start, end);
    }
    console.log("DEBUG: --- FINE BLOCCO ---");
}


const latexMathDecorator = new CompositeDecorator([
        {
            strategy: findLatexMath,
            component: LatexMathSpan
        },
    ]);

export default latexMathDecorator;


