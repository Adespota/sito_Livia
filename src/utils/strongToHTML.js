

// Trasforma il testo che rende Gemini con gli asterischi **sono un testo d'esempio** in grassetto
export function strongToHTML (markdownText)  {
    if (!markdownText || typeof markdownText !== 'string') {
        return '';
    }
    // Converti **testo** in <strong>testo</strong>
    // Puoi aggiungere altre conversioni se necessario, es. *corsivo* in <em>corsivo</em>
    // htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};
