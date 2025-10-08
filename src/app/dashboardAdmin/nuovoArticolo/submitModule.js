import React, {useEffect, useState} from "react";

import {useDispatch, useSelector} from "react-redux";
import {
    initialArticoloState,
    resetAll,
    resetArticoloState,
    resetFileName,
    resetImagePreview,
    selectDocumentId,
    selectInitialStateArticolo,
    setArticleDate,
    setDocumentId,
    setInput,
    triggerSendToRedux,
} from "/src/reducer/features/articoloSlice";
import {openBozzaArticoloModal, openSalvaArticoloModal, openSendArticleModal,} from "/src/reducer/features/ModalSlice";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {firestore, storage,} from "@/app/firebase";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc} from 'firebase/firestore';
import {Button} from "@adespota/my-react-component";





function createTimestamps() {
    const timestamp = Timestamp.now();
    const date = timestamp.toMillis();
    const firebaseTimestamp = Timestamp.fromMillis(date);
    return { date, firebaseTimestamp };
}

/*
// Funzioni di trim e slugification
function trim(value) {
    return value.trim();
}
 */

function addHyphens(value) {
    return value.toLowerCase()
        .normalize('NFD') // Decomposizione dei caratteri accentati
        .replace(/[\u0300-\u036f]/g, '') // Rimozione dei segni diacritici
        .replace(/[^\w\s]/g, '') // Rimozione di tutti i caratteri non di parole e spazi
        .trim() // Rimozione degli spazi iniziali e finali
        .replace(/\s+/g, '-'); // Sostituzione degli spazi con trattini
}




export default function SubmitModule() {
    const articoloState = useSelector(selectInitialStateArticolo);
    const dataArticolo = articoloState.dataArticolo;
    const firestoreTimestamp = Timestamp.fromMillis(dataArticolo);
    const dataAttuale = Timestamp.now(); // Data attuale
    const dispatch = useDispatch();
    const documentId = useSelector(selectDocumentId);
    const routeSource = useSelector(state => state.route.source);
    const loading = useSelector(state => state.articolo.loading);
    const [subscriberEmails, setSubscriberEmails] = useState([]);
    const MODAL_TYPE_SUCCESS = 'success';
    const MODAL_TYPE_FAILURE = 'failure';


/*
    useEffect(() => {
        console.log("Data articolo => => =>",dataArticolo);
        console.log("Data articolo TimeStamp => => =>", firestoreTimestamp);
        console.log("Data attuale dell'attuale articolo in formato TimeStamp => => =>", dataAttuale);
    }, [articoloState]);

 */




   async function uploadImage(fileInfo) {
        const {url: fileUrl, fileName} = fileInfo;
        // Controllo dell'URL
        if (!fileUrl || !fileName) {
            console.error("Invalid URL or fileName:", fileUrl, fileName);
            return;
        }
        console.log("Nome del file:", fileName);
        let response;
        try {
            response = await fetch(fileUrl);
        } catch (error) {
            console.error("Failed to fetch file from URL:", error);
            return;
        }
        const file = await response.blob();
        // Usa il nome del file originale per creare il percorso in Firebase Storage
        const filePath = `imagesBlogOscar/${fileName}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file).then((snapshot) => {
        });
        let URL = await getDownloadURL(storageRef);
        console.log("URL generato da Firebase Storage:", URL);
        // Rimuove l'estensione del file esistente dal URL e aggiunge ".webp"
       if (!fileName.endsWith('.svg')) {
           // Rimuove l'estensione del file esistente dall'URL e aggiunge ".webp"
           URL = URL.split('?')[0].replace(/\.[^/.]+$/, "") + ".webp" + '?' + URL.split('?')[1];
       }

       return URL;
   }


    function getTrimmedState(state) {
        let newTrimmedState = {};
        for (const [key, value] of Object.entries(state)) {
            newTrimmedState[key] = typeof value === 'string' ? value.trim() : value;
        }
        return newTrimmedState;
    }







    useEffect(() => {
        const getSubscriberEmails = async () => {
            try {
                const subscribersCollection = collection(firestore, "subscribers_oscar_newsletter");
                const subscriberSnapshots = await getDocs(subscribersCollection);

                const allEmails = subscriberSnapshots.docs.map(doc => doc.data().email);

                setSubscriberEmails(allEmails);
                console.log("Email degli iscritti:", allEmails);

            } catch (error) {
                console.error("Errore durante la lettura della collezione Firestore:", error);
            }
        };

        getSubscriberEmails();
    }, []);




    // Funzione che chiama una function cloud per inviare la email ai membri della newsLetter
    const sendArticle = async (subscriberEmails) => {
        try {

            const urlBase = "https://www.oscarprata.com/blog";
            const slug = articoloState.slug.toLowerCase();
            const urlCompleto = `${urlBase}/${slug}`;

            console.log("Url completo:", url);

            const response = await fetch("https://us-central1-psicologo-1361d.cloudfunctions.net/notificationNewsLetterOscar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    emails: subscriberEmails,
                    article: articoloState.titolo,
                    url: urlCompleto,
                }),
            });

            if (!response.ok) {
                throw new Error("Errore nell'invio dell'email")
            }

            const data = await response.json();

            console.log('Risposta dalla funzione Cloud di Firebase:', data);

        } catch (error) {
            console.error('Errore:', error.message);
        }
    }


    const send = () => async (dispatch, getState) => {
        dispatch(triggerSendToRedux(true));

        // Aspetta che lo stato Redux venga aggiornato
        await new Promise(resolve => setTimeout(resolve, 0));

        handleButtonSendArticle(dispatch, getState);

    };

    const sendBozza = () => async (dispatch, getState) => {
        dispatch(triggerSendToRedux(true));

        // Aspetta che lo stato Redux venga aggiornato
        await new Promise(resolve => setTimeout(resolve, 0));

        handleButtonClickSave(dispatch, getState);
    };




    // Ripulisce tutti i paragrafi nel localStorage
    const removeAllParagraphsFromLocalStorage = () => {
        // Ottieni tutte le chiavi del localStorage
        const keys = Object.keys(localStorage);

        // Filtra le chiavi che iniziano con 'paragrafo-'
        keys.forEach(key => {
            if (key.startsWith('paragrafo-')) {
                localStorage.removeItem(key);
            }
        });
        console.log('Tutti i paragrafi sono stati rimossi dal localStorage');
    };




    // Funzione per inviare l'articolo
    const handleButtonSendArticle = async (dispatch, getState) => {
        const articoloState = getState().articolo;
        const {date, firebaseTimestamp} = createTimestamps();
        dispatch(setArticleDate(date));

        try {
            const trimmedArticoloState = getTrimmedState(articoloState);
            const isEmptyField = ['categoria','immagine','indice', 'metaDescription','paragrafi','parolaChiave','sottotitolo', 'titolo', 'titoloSeo', 'slug',].some(key => !trimmedArticoloState[key]);
            if (isEmptyField) {
                dispatch(openSendArticleModal({modalTypeArticle: MODAL_TYPE_FAILURE}));
                return;
            }


            // Logica per inviare le immagini dei paragrafi allo storage
            let articoloStateCopy = JSON.parse(JSON.stringify(articoloState));
            for (let i = 0; i < articoloStateCopy.paragrafi.length; i++) {
                let paragrafo = articoloStateCopy.paragrafi[i];
                if (paragrafo.fileNameParagraph && paragrafo.imagePreviewParagraph) {
                    // Se il paragrafo ha un'immagine, carica l'immagine e aggiorna il campo immagine del paragrafo
                    let fileInfoParagrafo = {
                        url: paragrafo.imagePreviewParagraph,
                        fileName: paragrafo.fileNameParagraph
                    }
                    paragrafo.immagine = await uploadImage(fileInfoParagrafo);
                }
            }


            let updatedArticoloState = {...articoloStateCopy};

            if (articoloState.immagine && articoloState.fileName) {
                const fileInfo = {
                    url: articoloState.immagine,
                    fileName: articoloState.fileName,
                };

                const UrlStorage = await uploadImage(fileInfo);

                if (!UrlStorage) {
                    console.error('uploadImage non ha restituito un URL valido', fileInfo);
                    return;
                }

                await dispatch(setInput({field: "immagine", value: UrlStorage}));
                updatedArticoloState.immagine = UrlStorage;
            } else {
                console.log('Non è presente un nuovo URL e/o filename per l\'immagine');
            }

            delete updatedArticoloState.fileName;
            delete updatedArticoloState.imagePreview;

            updatedArticoloState.paragrafi = updatedArticoloState.paragrafi.map(paragrafo => {
                const {fileNameParagraph, imagePreviewParagraph, ...rest} = paragrafo;
                return rest;
            });

            // Applica trim e slugification
            if (updatedArticoloState.slug) {
                updatedArticoloState.slug = addHyphens((updatedArticoloState.slug).trim());
            }


            const {
                category,
                resetKey,
                article,
                loading,
                normalizedSlug,
                shouldSendToRedux,
                numeroParolePerParagrafo,
                numeroParoleTotali,
                validazione,
                linkInterniValido,
                linkEsterniValido,
                slugUnico,
                ...updatedArticoloWithoutCategory
            } = updatedArticoloState;


            if (!documentId) {
                try {
                    // Creare un riferimento per un nuovo documento in 'articoli_pubblicati_oscar'
                    const articoliPubblicatiRef = collection(firestore, 'articoli_pubblicati_oscar');
                    const newDocRef = doc(articoliPubblicatiRef);
                    await setDoc(newDocRef, {
                        ...updatedArticoloWithoutCategory,
                        dataArticolo: firebaseTimestamp,
                        documentId: newDocRef.id
                    });

                    console.log("Documento creato con ID:", newDocRef.id);
                    console.log("Dati inviati al db:", updatedArticoloWithoutCategory)

                    // Funzione cloud per inviare gli articoli agli utenti della newsletter
                    await sendArticle(subscriberEmails, updatedArticoloState);

                    dispatch(setDocumentId(newDocRef.id));
                    dispatch(resetImagePreview());
                    dispatch(resetFileName());
                    removeAllParagraphsFromLocalStorage();
                    dispatch(openSendArticleModal({modalTypeArticle: MODAL_TYPE_SUCCESS}));
                } catch (error) {
                    console.error("Errore durante la creazione del documento:", error);
                }
            } else {
                // Se documentId esiste in articoli_bozze_oscar deve inviarlo ad articoli_pubblicati_oscar ed eliminarlo da articoli_pubblicati_oscar
                const articoloDocRef = doc(firestore, 'articoli_bozze_oscar', documentId);
                const bozzaDocSnap = await getDoc(articoloDocRef);

                if (bozzaDocSnap.exists()) {
                    console.log("Il documento bozza esiste");
                    const bozzaDoc = bozzaDocSnap.data();

                    const newArticle = {
                        ...bozzaDoc,
                        ...updatedArticoloWithoutCategory,
                        dataArticolo: firebaseTimestamp
                    };
                    console.log("Creato nuovo oggetto articolo:", newArticle);

                    if (!newArticle.immagine) {
                        console.error('Field "immagine" is undefined');
                        return;
                    }

                    const articoliPubblicatiCollectionRef = collection(firestore, 'articoli_pubblicati_oscar');
                    const idArticoloRef = await addDoc(articoliPubblicatiCollectionRef, newArticle);

                    await updateDoc(idArticoloRef, {documentId: idArticoloRef.id});
                    console.log("Articolo caricato con ID: " + idArticoloRef.id);
                    await deleteDoc(articoloDocRef);
                    console.log("Bozza cancellata.");

                    //Funzione cloud per inviare gli articoli agli utenti della newsLetter
                    await sendArticle(subscriberEmails, updatedArticoloState);

                    dispatch(resetArticoloState());
                    dispatch(resetImagePreview());
                    dispatch(openSendArticleModal({modalTypeArticle: MODAL_TYPE_SUCCESS}));
                }
            }
        } catch (error) {
            console.error("Errore:", error);
        }
    }




    // Funzione per salvare l'articolo
    const handleButtonClickSave = async (dispatch, getState) => {
        const articoloState = getState().articolo;
        console.log("stato dell'articolo nel momento in cui salvo =>", articoloState);

        try {
            // Logica per inviare le immagini dei paragrafi allo storage
            let articoloStateCopy = JSON.parse(JSON.stringify(articoloState));
            for (let i = 0; i < articoloStateCopy.paragrafi.length; i++) {
                let paragrafo = articoloStateCopy.paragrafi[i];
                if (paragrafo.fileNameParagraph && paragrafo.imagePreviewParagraph) {
                    // Se il paragrafo ha un'immagine, carica l'immagine e aggiorna il campo immagine del paragrafo
                    let fileInfoParagrafo = {
                        url: paragrafo.imagePreviewParagraph,
                        fileName: paragrafo.fileNameParagraph
                    }
                    paragrafo.immagine = await uploadImage(fileInfoParagrafo);
                }
            }

            console.log("Valore di articoloState.immagine:", articoloState.immagine);
            let UrlStorage = articoloState.immagine; //Di default, mantieni il vecchio URL
            if (articoloState.fileName) { //Se c'è un nuovo file
                const fileInfo = {
                    url: articoloState.immagine,
                    fileName: articoloState.fileName,
                };
                UrlStorage = await uploadImage(fileInfo); //Ottieni il nuovo URL dell'immagine
            }
            //Imposta il nuovo URL (che potrebbe essere il vecchio se l'immagine non è cambiata)
            await dispatch(setInput({field: "immagine", value: UrlStorage}));

            const updatedArticoloState = {...articoloStateCopy, immagine: UrlStorage, dataArticolo:  firestoreTimestamp};
            delete updatedArticoloState.fileName;
            delete updatedArticoloState.imagePreview;
            updatedArticoloState.paragrafi = updatedArticoloState.paragrafi.map(paragrafo => {
                const {fileNameParagraph, imagePreviewParagraph, ...rest} = paragrafo;
                return rest;
            });

            // Applica trim e slugification
            if (updatedArticoloState.slug) {
                updatedArticoloState.slug = addHyphens((updatedArticoloState.slug).trim());
            }

            const {
                category,
                resetKey,
                article,
                loading,
                normalizedSlug,
                shouldSendToRedux,
                numeroParolePerParagrafo,
                numeroParoleTotali,
                validazione,
                linkInterniValido,
                linkEsterniValido,
                slugUnico,
                ...updatedArticoloWithoutCategory
            } = updatedArticoloState;


            if (documentId) {
                // Verifica se l'articolo esiste in articoli_bozze_oscar
                const articoloDocRef = doc(firestore, 'articoli_bozze_oscar', documentId);
                const docSnap = await getDoc(articoloDocRef);
                if (docSnap.exists()) {
                    try {
                        console.log("updatedArticoloWithoutCategory", updatedArticoloWithoutCategory);
                        await updateDoc(articoloDocRef, updatedArticoloWithoutCategory);
                        dispatch(openBozzaArticoloModal({modalTypeBozzaArticolo: MODAL_TYPE_SUCCESS}));
                    } catch (error) {
                        console.error('Errore durante l\'aggiornamento dell\'articolo:', error);
                    }
                }
            } else {
                // Se non esiste un documentId in articoli_bozze_oscar, si tratta di un nuovo articolo che l'utente vuole salvare
                const articoliBozzeRef = collection(firestore, 'articoli_bozze_oscar');
                const newDocRef = doc(articoliBozzeRef);
                const articoloId = newDocRef.id;

                // Creare un nuovo documento in 'articoli_bozze_oscar' utilizzando l'ID appena generato
                await setDoc(newDocRef, {
                    ...updatedArticoloWithoutCategory,
                    dataArticolo: dataAttuale,
                    documentId: articoloId
                });
                dispatch(setDocumentId(articoloId));
                dispatch(openBozzaArticoloModal({modalTypeBozzaArticolo: MODAL_TYPE_SUCCESS}));
                dispatch(resetArticoloState());
                dispatch(resetImagePreview());
            }
            if (documentId) {
                // Verifica se l'articolo esiste negli articoli_pubblicati_oscar
                const articoloDocRef = doc(firestore, 'articoli_pubblicati_oscar', documentId);
                const docSnap = await getDoc(articoloDocRef);
                if (docSnap.exists()) {
                    try {
                        // Se l'articolo è negli articoli_pubblicati_oscar, aggiornalo e mostra la modale di success di bozza
                        console.log("updatedArticoloWithoutCategory", updatedArticoloWithoutCategory);
                        await updateDoc(articoloDocRef, updatedArticoloWithoutCategory);
                        dispatch(openSalvaArticoloModal({modalTypeSalvaArticoloPubblicato: MODAL_TYPE_SUCCESS}));
                    } catch (error) {
                        console.error('Errore durante l\'aggiornamento dell\'articolo:', error);
                    }
                }
            }
        } catch (error) {
            console.error("Errore durante il salvataggio dell'articolo:", error);
        }
    };


    // Funzione per ripulire i campi della form compreso l'id
    // e permettere di generare un nuovo articolo
    const handleButtonNewArticle = () => {
        dispatch(resetArticoloState());
        dispatch(resetAll());
        dispatch(resetImagePreview())
        dispatch(setDocumentId(null)); // Resetta l'ID dell'articolo
    }


    return (
        <>
            <div className="rounded-2xl bg-white px-10 py-10 space-y-5">
                <div className="flex flex-col md:flex-row w-full">
                    <p className="basis-1/4 mb-3 md:mb-0 text-[1.2rem] font-semibold">Invia o salva bozza</p>
                    <div className="flex md:flex-grow md:justify-end justify-start md:space-x-5 space-x-3">
                        {routeSource === 'nuovo_articolo' && (
                            <Button
                                buttonTextDesktop="Nuovo"
                                onClick={handleButtonNewArticle}
                            />
                        )}
                        <Button
                            buttonTextDesktop="Salva"
                            onClick={() => dispatch(sendBozza())}
                        />
                        {routeSource !== 'articoli_pubblicati' && (
                            <Button
                                isLoading={loading}
                                buttonTextDesktop="Invia"
                                onClick={() => dispatch(send())}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
