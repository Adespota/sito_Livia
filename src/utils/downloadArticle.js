// utils/downloadArticle.js
export const downloadArticle = (articolo, handleShowSnackbar) => { // Mantieni handleShowSnackbar se lo usi per altri scopi, altrimenti puoi rimuoverlo da qui
    if (!articolo || !articolo.titolo) {
        console.warn("downloadArticle: Articolo o titolo mancante. Download non avviato.");
        // Chiama il callback per segnalare il fallimento se i dati sono insufficienti
        if (handleShowSnackbar) { // Verifica che il callback sia stato passato
            handleShowSnackbar("Impossibile avviare il download: dati articolo mancanti.", "error");
        }
        return;
    }

    try {
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <title>${articolo.titolo}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2cm; }
                    h1 { font-size: 24pt; text-align: center; margin-bottom: 1cm; }
                    h2 { font-size: 18pt; margin-top: 1cm; }
                    p { font-size: 12pt; line-height: 1.5; margin-bottom: 0.5cm; }
                    .seo-data { margin-top: 2cm; padding-top: 1cm; border-top: 1px solid #ccc; font-size: 10pt; color: #555; }
                    .seo-data h3 { font-size: 14pt; margin-bottom: 0.5cm; }
                    .seo-data p { margin-bottom: 0.2cm; }
                </style>
            </head>
            <body>
                <h1>${articolo.titolo}</h1>
        `;

        if (articolo.sottotitolo) {
            htmlContent += `<h2>${articolo.sottotitolo}</h2>`;
        }
        if (Array.isArray(articolo.indice) && articolo.indice.length) {
            htmlContent += `<p>Indice</p><ul class="indice-list">`;
            articolo.indice.forEach(item => {
                htmlContent += `<li>${item}</li>`;
            });
            htmlContent += `</ul>`;
        }

        articolo.paragrafi.forEach(p => {
            if (p.titoloParagrafo) {
                htmlContent += `<h2>${p.titoloParagrafo}</h2>`;
            }
            if (p.contenuto) {
                htmlContent += `<p>${p.contenuto}</p>`;
            }
        });

        // Dati SEO
        if (articolo.parolaChiave || articolo.titoloSeo || articolo.slug || articolo.metaDescription) {
            htmlContent += `<div class="seo-data">
                <h3>Dati SEO</h3>`;
            if (articolo.parolaChiave) {
                htmlContent += `<p><strong>Parola Chiave:</strong> ${articolo.parolaChiave}</p>`;
            }
            if (articolo.titoloSeo) {
                htmlContent += `<p><strong>Titolo SEO:</strong> ${articolo.titoloSeo}</p>`;
            }
            if (articolo.slug) {
                htmlContent += `<p><strong>Slug:</strong> ${articolo.slug}</p>`;
            }
            if (articolo.metaDescription) {
                htmlContent += `<p><strong>Meta Description:</strong> ${articolo.metaDescription}</p>`;
            }
            htmlContent += `</div>`;
        }

        htmlContent += `
                </body>
                </html>
            `;

        const fileName = `${articolo.titolo.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob); // Definisci 'url' prima di usarlo

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Libera la risorsa URL del Blob

        // Chiama il callback per segnalare il successo dell'avvio del download
        if (handleShowSnackbar) { // Verifica che il callback sia stato passato
            handleShowSnackbar("Articolo scaricato con successo!", "success");
        }
    } catch (error) {
        console.error("Errore durante la preparazione o l'avvio del download:", error);
        // Chiama il callback per segnalare il fallimento
        if (handleShowSnackbar) { // Verifica che il callback sia stato passato
            handleShowSnackbar(`Errore durante il download: ${error.message || "ignoto"}`, "error");
        }
    }
};
