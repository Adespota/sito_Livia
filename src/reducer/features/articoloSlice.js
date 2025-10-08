import {createSlice, nanoid} from "@reduxjs/toolkit";
import {set} from "lodash";

// Questo file definisce il slice "articolo" utilizzando Redux Toolkit per gestire lo stato di un articolo di blog
// Lo stato include diverse proprietà come la categoria selezionata, i paragrafi, il titolo, la descrizione SEO, immagini, e altro
// Sono definiti anche diversi reducer per aggiornare lo stato, come l'aggiunta di paragrafi, la selezione di categorie, l'impostazione di immagini e altre azioni specifiche
// Il file esporta le azioni, i selettori per accedere a parti specifiche dello stato e il reducer associato allo slice "articolo"

const normalizeUrl = url =>
    url
        .trim()
        .toLowerCase()
        .replace(/\/+$/, ''); // rimuove slash finali



const initialArticoloState = {
    categoria: "",
    linkInterni: [],
    indice: [],
    documentId: null,
    titolo: "",
    sottotitolo: "",
    immagine: "",
    paragrafi: [
        {
            id: nanoid(),
            titoloParagrafo: "",
            contenuto: "",
        },
    ],
    dataArticolo: null,
    parolaChiave: "",
    titoloSeo: "",
    slug: "",
    slugUnico: true,
    metaDescription: "",
    newCategory: undefined,
    newDescription: undefined,
    fileName: "",
    imagePreview: null,
    normalizedSlug: "",
    article: null,
    loading: false,
    category: [],
    resetKey: 0,
    punteggioSEO: "",
    numeroParolePerParagrafo: {},
    numeroParoleTotali: 0,
    shouldSendToRedux: false,
    validazione: {
        titoloValido: false,
        sottotitoloValido: false,
        parolaChiaveValida: false,
        titoliParagrafiValidi: false,
        titoloSeoValido: false,
        metaDescriptionValida: false,
        slugValido: false,
        lunghezzaArticoloValida: false,
        parolaChiavePrimoParagrafoValida: false,
        frasiValideCongiunzioniPronomi: [],
        frasiValide: [],
        linkInterniValido: false,
        linkEsterniValido: false,
    },
};

const countWords = (text) => {
    return text.trim().split(/\s+/).length;
};




export const articoloSlice = createSlice({
    name: "articolo",
    initialState: initialArticoloState,
    reducers: {
        updateParolaChiaveFromGemini: (state, action) => {
            state.parolaChiave = action.payload;
        },
        updateTitoloSeoFromGemini: (state, action) => {
            state.titoloSeo = action.payload;
        },
        updateSlugFromGemini: (state, action) => {
            state.slug = action.payload;
        },
        updateMetaDescriptionFromGemini: (state, action) => {
            state.metaDescription = action.payload;
        },
        updateTitleFromGemini: (state, action) => {
            state.titolo = action.payload;
        },
        updateSubtitleFromGemini: (state, action) => {
            state.sottotitolo = action.payload;
        },
        updateTitleParagraph: (state, action) => {
            const { index, newTitle } = action.payload;
            if (index >= 0 && index < state.paragrafi.length) {
                state.paragrafi[index].titoloParagrafo = newTitle;
            } else {
                console.error('Indice fuori range durante l\'aggiornamento del titolo del paragrafo.');
            }
        },
        updateContentParagraph: (state, action) => {
            const { index, newParagraph } = action.payload;
            if (index >= 0 && index < state.paragrafi.length) {
                state.paragrafi[index].contenuto = newParagraph;
            } else {
                console.error('Indice fuori range durante l\'aggiornamento del contenuto del paragrafo.');
            }
        },
        triggerResetKey: (state) => {
            state.resetKey += 1; // Incrementa la key per forzare il re-rendering
            console.log("Reset Key Triggered:", state.resetKey);
        },
        setInput: (state, action) => {
            const { field, value } = action.payload;
            return {
                ...state,
                [field]: value,
            };
        },
        triggerSendToRedux: (state, action) => {
            state.shouldSendToRedux = action.payload;
        },
        resetAll: (state) => {
            state.indice = [];
            state.parolaChiave = "";
            state.titoloSeo = "";
            state.slug = "";
            state.metaDescription = "";
            state.titolo = "";
            state.sottotitolo = "";
            state.numeroParolePerParagrafo = {};

        },
        deleteAllParagraphs: (state) => {
            state.paragrafi = [];
        },
        addParagraph: (state) => {
            const newParagraph = {
                id: nanoid(),
                titoloParagrafo: "",
                contenuto: "",
            };
            state.paragrafi.push(newParagraph);
        },
        setInputPath: (state, action) => {
            const { path, value } = action.payload;
            console.log('Path:', path);
            console.log('Value:', value);
            console.log('setInputPath payload', action.payload);
            set(state, path, value);
            console.log('Updated state', state);
        },

        setSelectedCategory: (state, action) => {
            state.categoria = action.payload;
        },
        setCategory(state, action) {
            state.category = action.payload;
        },
        setLinkInterni: (state, action) => {
            state.linkInterni = Array.isArray(action.payload)
                ? action.payload.flat(Infinity)
                : [];
        },
        // Azione per impostare il nome del file
        setFileName: (state, action) => {
            state.fileName = action.payload;
        },
        // Azione per mostrare l'immagine di anteprima
        setImagePreview: (state, action) => {
            state.imagePreview = action.payload;
        },
        // Funzione per ripulire il campo immagine di copertina
        resetImagePreview: (state) => {
            state.imagePreview = null;
        },
        setFileNameImageParagraph: (state, action) => {
            const {index, value} = action.payload;
            if (index >= 0 && index < state.paragrafi.length) {
                state.paragrafi[index].fileNameParagraph = value;
            } else {
                console.error('Index out of range when setting fileNameParagraph');
            }
        },
        setImagePreviewParagraph: (state, action) => {
            const { index, value } = action.payload;
            if (index >= 0 && index < state.paragrafi.length) {
                state.paragrafi[index].imagePreviewParagraph = value;
            } else {
                console.error('Index out of range when setting image preview for paragraph');
            }
        },
        resetImagePreviewParagraph: (state, action) => {
            const index = action.payload;
            state.paragrafi[index].imagePreviewParagraph = null;
        },
        resetImageInParagraph: (state, action) => {
            const index = action.payload;
            state.paragrafi[index].immagine = initialArticoloState.immagine;
        },
        // Azione per gestire l'id del documento generato da Firestore
        setDocumentId: (state, action) => {
            state.documentId = action.payload;
        },
        updateIndiceFromGemini: (state) => {
            // Ricostruisce l'indice leggendo i titoli dei paragrafi dallo stato
            state.indice = state.paragrafi.map((p, idx) =>
                `${idx + 1}. ${p.titoloParagrafo}`
            );
        },
        // Aggiorna l'indice con il titolo del paragrafo
        updateIndice: (state, action) => {
            const { titoloParagrafo, indiceParagrafo } = action.payload;
            // Aggiorna l'indice corrispondente al paragrafo attuale con il nuovo titolo del paragrafo
            state.indice[indiceParagrafo] = `${indiceParagrafo + 1}. ${titoloParagrafo}`;
        },
        deleteParagraph: (state, action) => {
            const index = action.payload;

            // Rimuovi il paragrafo dall'array
            state.paragrafi.splice(index, 1);

            // Rimuovi il titolo dall'indice
            state.indice.splice(index, 1);

            // Aggiorna la numerazione dell'indice dopo l'eliminazione
            state.indice = state.indice.map((titolo, idx) => {
                return `${idx + 1}. ${state.paragrafi[idx]?.titoloParagrafo || ''}`;
            });
        },
        // Azione per creare la nuova categoria nel blog
        setSelectedNewCategory: (state, action) => {
            state.newCategory = action.payload;
        },
        // Azione per resettare il campo newCategory
        resetNewCategory: (state,) => {
            state.newCategory = undefined;
        },
        resetNewDescription: (state,) => {
            state.newDescription = undefined;
        },
        // Azione per impostare la data e l'ora corrente
        setArticleDate: (state, action) => {
            state.dataArticolo = action.payload;
        },
        // Funzione per ripulire i campi dell'articolo
        resetArticoloState: (state) => {
            Object.assign(state, initialArticoloState);
        },
        // Funzione per ripulire il campo immagine di copertina
        resetImage: (state) => {
            state.immagine = initialArticoloState.immagine;
        },
        resetFileName:(state) => {
            state.fileName = "";
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        validaParolaChiave: (state) => {
            // Imposta parolaChiaveValida a true se la parola chiave non è vuota e contiene caratteri significativi
            state.validazione.parolaChiaveValida = !!state.parolaChiave?.trim();
        },
        // Validazione titolo SEO
        validaTitoloSeo: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase() || "";
            const titoloSeo = state.titoloSeo?.trim().toLowerCase() || "";
            // Controlla se il titolo inizia esattamente con la parola chiave
            state.validazione.titoloSeoValido = parolaChiave && titoloSeo.startsWith(parolaChiave);
        },
        // Validazione meta description
        validaMetaDescription: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase() || "";
            state.validazione.metaDescriptionValida =
                state.metaDescription &&
                state.metaDescription.toLowerCase().includes(parolaChiave) &&
                state.metaDescription.length >= 120 &&
                state.metaDescription.length <= 155;
        },
        /*
        verificaUnicitaSlug: (state, action) => {
            state.slugUnico = action.payload;
        },

         */
        validaSlug: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase();
            const slug = state.slug?.trim().toLowerCase();
            const slugUnico = state.slugUnico;

            // Verifica che lo slug contenga la parola chiave e che sia breve (max 50 caratteri)
            state.validazione.slugValido = parolaChiave && slug.includes(parolaChiave) && slug.length <= 50 && slugUnico;
        },
        validaTitolo: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase();
            const titolo = state.titolo?.trim().toLowerCase();

            // Verifica che il titolo contenga la parola chiave
            state.validazione.titoloValido = parolaChiave && titolo.includes(parolaChiave);
        },
        validaSottotitolo: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase();
            const sottotitolo = state.sottotitolo?.trim().toLowerCase();

            // Verifica che il titolo contenga la parola chiave
            state.validazione.sottotitoloValido = parolaChiave && sottotitolo.includes(parolaChiave);
        },
        validaTitoliParagrafi: (state) => {
            const parolaChiave = state.parolaChiave?.trim().toLowerCase();
            console.log("Parola chiave:", parolaChiave);

            // Filtra i titoli paragrafi per escludere quelli vuoti
            const titoliParagrafi = state.paragrafi
                .map(paragrafo => paragrafo.titoloParagrafo?.trim().toLowerCase())
                .filter(titolo => titolo !== "");
            console.log("Titoli non vuoti:", titoliParagrafi);

            // Calcola il numero totale di titoli non vuoti
            const totaleTitoli = titoliParagrafi.length;
            console.log("Totale titoli non vuoti:", totaleTitoli);

            // Se non ci sono titoli non vuoti, la validazione è falsa
            if (totaleTitoli === 0 || !parolaChiave) {
                state.validazione.titoliParagrafiValidi = false;
                console.log("Validazione fallita: nessun titolo valido o parola chiave mancante.");
                return;
            }

            // Calcola i titoli contenenti la parola chiave
            const titoliConParolaChiave = titoliParagrafi.filter(titolo => titolo.includes(parolaChiave));
            console.log("Titoli contenenti la parola chiave:", titoliConParolaChiave);

            // Calcola il numero minimo di titoli richiesti
            const minimoTitoliConParolaChiave = Math.ceil(totaleTitoli / 2);
            console.log("Minimo richiesto per validazione:", minimoTitoliConParolaChiave);

            // Verifica se la condizione è rispettata
            const isValid = titoliConParolaChiave.length >= minimoTitoliConParolaChiave;
            state.validazione.titoliParagrafiValidi = isValid;

            // Log finale per validazione
            console.log("Validazione finale:", isValid, {
                totaleTitoli,
                titoliConParolaChiave: titoliConParolaChiave.length,
                minimoRichiesto: minimoTitoliConParolaChiave,
            });
        },
        setContaParole: (state, action) => {
            const { index, wordCount } = action.payload;
            state.numeroParolePerParagrafo[index] = wordCount;
        },
        setContaParoleTotale: (state) => {
            let totaleParole = 0;

            // Conta parole nel titolo, solo se non è vuoto
            if (state.titolo && state.titolo.trim() !== "") {
                totaleParole += countWords(state.titolo);
            }
            // Conta parole nel sottotitolo, solo se non è vuoto
            if (state.sottotitolo && state.sottotitolo.trim() !== "") {
                totaleParole += countWords(state.sottotitolo);
            }
            // Itera sui paragrafi per sommare il numero di parole nei titoli
            if (state.paragrafi && Array.isArray(state.paragrafi)) {
                state.paragrafi.forEach((paragrafo, index) => {
                    if (paragrafo.titoloParagrafo && paragrafo.titoloParagrafo.trim() !== "") {
                        totaleParole += countWords(paragrafo.titoloParagrafo);
                    }
                });
            }
            if (state.numeroParolePerParagrafo) {
                totaleParole += Object.values(state.numeroParolePerParagrafo).reduce((acc, val) => acc + val, 0);
            }
            // Aggiorna il totale delle parole nel state
            state.numeroParoleTotali = totaleParole;
            // Validazione dell'articolo
            state.validazione.lunghezzaArticoloValida = totaleParole >= 1000;
        },
        updateParolePerParagrafo: (state, action) => {
            const { index } = action.payload;
            const parolePerParagrafo = { ...state.numeroParolePerParagrafo };

            // Rimuovi il paragrafo specificato
            delete parolePerParagrafo[index];

            // Ricostruisci l'oggetto mantenendo la sequenza degli indici
            const numeroParolePerParagrafo = {};
            let newIndex = 0;

            Object.keys(parolePerParagrafo)
                .sort((a, b) => parseInt(a) - parseInt(b)) // Ordina le chiavi numeriche
                .forEach((key) => {
                    // Assegna i nuovi indici sequenziali
                    numeroParolePerParagrafo[newIndex] = parolePerParagrafo[key];
                    newIndex++;
                });

            // Aggiorna lo stato con l'oggetto riformattato
            return {
                ...state,
                numeroParolePerParagrafo: numeroParolePerParagrafo,
            };
        },
        removeAllNumeroParolePerParagrafo: (state) => {
            state.numeroParolePerParagrafo = {};
        },
        validaLinkInterni: (state) => {
            // 1) Normalizzo i link interni
            const internalNorm = state.linkInterni.map(normalizeUrl);

            // 2) Trovo TUTTI gli href in ogni paragrafo
            const estraiLink = contenuto =>
                Array.from(contenuto.matchAll(/<a\s+href="([^"]+)"/gi), m => m[1]);

            // 3) Verifico se almeno uno degli href normalizzati è incluso in internalNorm
            state.validazione.linkInterniValido = state.paragrafi.some(({contenuto}) => {
                const hrefs = estraiLink(contenuto).map(normalizeUrl);
                return hrefs.some(h => internalNorm.includes(h));
            });
        },
        validaLinkEsterni: (state) => {
            // 1) Normalizzo di nuovo i link interni
            const internalNorm = state.linkInterni.map(normalizeUrl);

            // 2) Stessa funzione per estrarre href
            const estraiLink = contenuto =>
                Array.from(contenuto.matchAll(/<a\s+href="([^"]+)"/gi), m => m[1]);

            // 3) Verifico se esiste almeno un href NORMALIZZATO che NON è in internalNorm
            state.validazione.linkEsterniValido = state.paragrafi.some(({contenuto}) => {
                const hrefs = estraiLink(contenuto).map(normalizeUrl);
                return hrefs.some(h => !internalNorm.includes(h));
            });
        },
        validaParolaChiavePrimoParagrafo(state) {
            const parolaChiave = state?.parolaChiave?.trim().toLowerCase();
            if (!parolaChiave) {
                state.validazione.parolaChiavePrimoParagrafoValida = false;
                return;
            }
            state.validazione.parolaChiavePrimoParagrafoValida = state.paragrafi.some((paragrafo, index) => {
                if (index === 0) { // Consideriamo solo il primo paragrafo
                    // Rimuovi i tag HTML manualmente usando un'espressione regolare ma mantiene il contenuto
                    let primaFrase = paragrafo.contenuto.replace(/<[^>]+>/g, "").toLowerCase();

                    console.log("Primissima frase senza tag HTML:", primaFrase);

                    // Controllare se la parola chiave è presente
                    const parolaChiaveRegex = new RegExp(`\\b${parolaChiave}\\b`, 'i');
                    const contieneParolaChiave = parolaChiaveRegex.test(primaFrase);

                    state.validazione.parolaChiavePrimoParagrafoValida = contieneParolaChiave;

                    console.log("Parola chiave trovata nella prima frase:", contieneParolaChiave);
                    console.log(" => => => state.validazione.parolaChiavePrimoParagrafoValida:", state.validazione.parolaChiavePrimoParagrafoValida);
                    return contieneParolaChiave;
                }

                return false; // Se non è il primo paragrafo
            });

            console.log("Parola chiave valida nel primo paragrafo:", state.validazione.parolaChiavePrimoParagrafoValida);
        },
        validaFrasi: (state) => {
            // Verifica che l'array dei paragrafi non sia vuoto o non definito
            if (!state.paragrafi || state.paragrafi.length === 0) {
                console.log("Nessun paragrafo presente.");
                state.validazione.frasiValide = []; // Imposta un array vuoto se non ci sono paragrafi
                return;
            }

            // Crea un array per memorizzare la validazione di ogni paragrafo
            const nuoveFrasiValide = state.paragrafi.map((paragrafo, index) => {
                const contenuto = paragrafo.contenuto;

                // Log per controllare il contenuto di ciascun paragrafo
                console.log(`Validando paragrafo ${index + 1}:`, contenuto);

                // Se il contenuto è vuoto o non definito, ritorna false per questo paragrafo
                if (!contenuto || contenuto.trim() === "" || contenuto === '<p><br></p>' || contenuto === '<br><br>' || contenuto === '<br>') {
                    console.log(`Paragrafo ${index + 1} è vuoto o non definito.`);
                    return false; // Paragrafo non valido
                }

                // Suddivide il contenuto in frasi
                const frasi = contenuto.match(/[^.!?]+[.!?]/g) || [];
                console.log(`Paragrafo ${index + 1}: Trovate ${frasi.length} frasi.`);

                // Filtra le frasi con più di 20 parole
                const frasiLunghe = frasi.filter(frase => frase.split(/\s+/).length > 20);
                console.log(`Paragrafo ${index + 1}: ${frasiLunghe.length} frasi lunghe rilevate.`);

                // Ritorna true solo se ci sono massimo 5 frasi lunghe
                return frasiLunghe.length <= 5;
            });

            // Log del risultato finale (array di validazione dei paragrafi)
            console.log("Frasi valide per ogni paragrafo:", nuoveFrasiValide);

            // Aggiorna lo stato solo se è cambiato
            if (JSON.stringify(state.validazione.frasiValide) !== JSON.stringify(nuoveFrasiValide)) {
                state.validazione.frasiValide = nuoveFrasiValide;
            }
        },
        validaFrasiCongiunzioniPronomi: (state) => {
            const congiunzioni = [
                "perché", "che", "ma", "poiché", "e", "o", "dunque", "quindi",
                "sebbene", "nonostante", "finché", "mentre", "tuttavia", "oppure",
                "infatti", "benché", "così", "quando", "qualora", "pure",
                "invece", "comunque", "anzi", "neppure", "né", "se", "come",
                "addirittura", "perfino", "altrimenti", "anche"
            ];

            const pronomi = [
                "egli", "ella", "essi", "esse", "loro", "che", "cui", "quale",
                "qual", "ciò", "questo", "quello", "quella", "queste", "questi",
                "quei", "quelle", "noi", "voi", "me", "te", "lui", "lei", "io",
                "chi", "alcuno", "ognuno", "nessuno", "tutti", "qualcuno",
                "ciascuno", "alcuna", "nessuna", "se stesso", "se stessa"
            ];

            const sogliaBase = 6;
            const paroleBase = 200;

            function contaParoleNelTesto(testo, listaParole) {
                return listaParole.reduce((conteggio, parola) => {
                    const regex = new RegExp(`\\b${parola}\\b`, 'gi');
                    const match = testo.match(regex);
                    return conteggio + (match ? match.length : 0);
                }, 0);
            }

            function calcolaSogliaDinamica(testo) {
                const numeroParole = testo.trim().split(/\s+/).length;
                return Math.max(1, Math.ceil((numeroParole * sogliaBase) / paroleBase));
            }


            state.validazione.frasiValideCongiunzioniPronomi = state.paragrafi.map((paragrafo) => {
                const contenuto = paragrafo.contenuto;

                if (!contenuto || contenuto.trim() === "") {
                    return false; // Paragrafo vuoto non valido
                }

                const conteggioCongiunzioni = contaParoleNelTesto(contenuto, congiunzioni);
                const conteggioPronomi = contaParoleNelTesto(contenuto, pronomi);
                const totale = conteggioCongiunzioni + conteggioPronomi;

                const sogliaDinamica = calcolaSogliaDinamica(contenuto);

                console.log(`Paragrafo: "${contenuto}"`);
                console.log(`Numero di parole: ${contenuto.trim().split(/\s+/).length}, Soglia dinamica: ${sogliaDinamica}`);
                console.log(`Congiunzioni trovate: ${conteggioCongiunzioni}, Pronomi trovati: ${conteggioPronomi}, Totale: ${totale}`);

                // Verifica se il totale supera la soglia dinamica
                return totale >= sogliaDinamica;
            });

            console.log("Frasi valide (Congiunzioni e Pronomi):", state.validazione.frasiValideCongiunzioniPronomi);
        },
        setPunteggioSEO: (state, action) => {
            state.punteggioSEO = action.payload;
        },



        // Validazione completa
        validaTutto: (state) => {
            articoloSlice.caseReducers.validaParolaChiave(state);
            articoloSlice.caseReducers.validaTitoloSeo(state);
            articoloSlice.caseReducers.validaMetaDescription(state);
            articoloSlice.caseReducers.validaSlug(state);
            articoloSlice.caseReducers.validaTitolo(state);
            articoloSlice.caseReducers.validaSottotitolo(state);
            articoloSlice.caseReducers.validaTitoliParagrafi(state);
            articoloSlice.caseReducers.validaLinkInterni(state);
            articoloSlice.caseReducers.validaLinkEsterni(state);
            articoloSlice.caseReducers.validaParolaChiavePrimoParagrafo(state);
            articoloSlice.caseReducers.validaFrasi(state);
            articoloSlice.caseReducers.validaFrasiCongiunzioniPronomi(state);
        },
    },
});
// Estrai le azioni create
export const {
    updateIndiceFromGemini,
    triggerResetKey,
    updateParolaChiaveFromGemini,
    updateMetaDescriptionFromGemini,
    updateTitoloSeoFromGemini,
    updateSlugFromGemini,
    updateTitleFromGemini,
    updateSubtitleFromGemini,
    updateTitleParagraph,
    updateContentParagraph,
    deleteAllParagraphs,
    setInput,
    setInputPath,
    setSelectedCategory,
    setLinkInterni,
    resetNewDescription,
    setDocumentId,
    resetImage,
    addParagraph,
    updateIndice,
    deleteParagraph,
    setSelectedNewCategory,
    resetNewCategory,
    setArticleDate,
    resetArticoloState,
    setFileName,
    setImagePreview,
    resetImagePreview,
    setFileNameImageParagraph,
    setImagePreviewParagraph,
    resetImagePreviewParagraph,
    resetImageInParagraph,
    resetFileName,
    resetAll,
    setLoading,
    setCategory,
    triggerSendToRedux,
    validaTutto,
    setContaParole,
    setContaParoleTotale,
    updateParolePerParagrafo,
    removeAllNumeroParolePerParagrafo,
    verificaUnicitaSlug,
    setPunteggioSEO,
} = articoloSlice.actions;

// Seleziona parti dello stato
export const selectInitialStateArticolo = (state) => state.articolo;
export const selectNewCategory = (state) => state.articolo.newCategory;
export const selectNewDescriptionOfCategory = (state) => state.articolo.newDescription;
export const selectDocumentId = (state) => state.articolo.documentId;
export const selectImagePreview = (state) => state.articolo.imagePreview;
export const selectImagePreviewParagraph = (index) => (state) => state.articolo.paragrafi[index]?.imagePreviewParagraph;
export const selectLoading = (state) => state.articolo.loading;
export const selectCategories = (state) => state.articolo.category;
export const selectSelectedCategory = (state) => state.articolo.categoria;
export const selectLinkInterni = (state) => state.articolo.linkInterni;
// Esporto tutte le validazioni
export const selectValidazione = (state) => state.articolo.validazione;





// Esporta il reducer
export default articoloSlice.reducer;

// Esporta l'oggetto di stato iniziale
export { initialArticoloState, };


