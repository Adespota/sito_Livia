import DOMPurify from "dompurify";

export const calculateWordCount = (htmlContent) => {
    // Rimuove i tag HTML e conteggia le parole
    const textContent = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [] });
    const wordArray = textContent.trim().split(/\s+/);
    return wordArray.filter(word => word.length > 0).length;
};
