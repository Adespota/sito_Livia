import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    limit,
    getFirestore,
} from 'firebase/firestore';
import { firestore } from "@/app/firebase";


import { savePublished, articlesPublishedTable, deletePublished } from '@/app/dexie';


// Sentinella a livello di modulo per garantire l'esecuzione singola
let isSyncStarted = false;
let unsubscribeFromFirestore = null;




export const startArticlesSync = async () => {
    if (isSyncStarted) {
        console.log("🟡 [SERVICE] Servizio di sincronizzazione articoli già attivo, non faccio nulla.");
        return;
    }

    console.log("🟢 [SERVICE] Avvio del servizio di sincronizzazione articoli...");
    isSyncStarted = true;


    try {
        const cachedCount = await articlesPublishedTable.count();
        const colRef = collection(firestore, 'articoli_pubblicati');

        // Se Dexie è vuoto, esegui il caricamento iniziale di 40 articoli
        if (cachedCount === 0) {
            console.log("📦 [DEXIE] Cache vuota. Avvio il caricamento iniziale di 40 articoli da Firestore.");
            const initialQuery = query(colRef, orderBy('dataArticolo', 'desc'), limit(40));
            const querySnapshot = await getDocs(initialQuery);
            const articles = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const articleDoc = {
                    id: doc.id,
                    categoria: data?.categoria ?? 'Categoria non disponibile',
                    autore: "Livia di Caterino",
                    titolo: data?.titolo ?? 'Titolo non disponibile',
                    sintesi: data?.sintesi ?? 'Non disponibile',
                    puntiChiave: data?.puntiChiave ?? [],
                    dataArticolo: data?.dataArticolo instanceof Timestamp ? data.dataArticolo.toDate().toISOString() : new Date().toISOString(),
                    isDeleteDisabled: data?.isDeleteDisabled ?? false,
                    contenuto: data.paragrafi ? data.paragrafi.map((p) => p.contenuto).join(' ') : 'N/A',
                    immagine: data?.immagine ?? 'Immagine non disponibile',
                    indice: Array.isArray(data?.indice) ? data.indice : ['Indice non disponibile'],
                    metaDescription: data?.metaDescription ?? 'Meta description non disponibile',
                    slug: data?.slug ?? 'Slug non disponibile',
                    sottotitolo: data?.sottotitolo ?? 'Sottotitolo non disponibile',
                    paragrafi: data.paragrafi ? data.paragrafi.map((par) => ({
                        immagine: par.immagine ?? 'Immagine non disponibile',
                        titoloParagrafo: par.titoloParagrafo ?? 'Titolo paragrafo non disponibile',
                        contenuto: par.contenuto ?? 'Contenuto non disponibile'
                    })) : [],
                    titoloSeo: data?.titoloSeo ?? 'Titolo SEO non disponibile',
                    parolaChiave: data?.parolaChiave ?? 'Parola chiave non disponibile',
                    punteggioSEO: data?.punteggioSEO ?? '',
                    faq: Array.isArray(data.faq) ? data.faq.map((faqItem) => ({
                        domanda: faqItem.domanda ?? 'Domanda non disponibile',
                        risposta: faqItem.risposta ?? 'Risposta non disponibile'
                    })) : []
                };
                articles.push(articleDoc);
            });
            await savePublished(articles);
            console.log(`✅ [FIRESTORE] Caricati e salvati ${articles.length} articoli iniziali in Dexie.`);
        } else {
            console.log(`📦 [DEXIE] Trovati ${cachedCount} articoli in cache. Salto il caricamento iniziale.`);
        }

        // Avvia l'ascoltatore di Firebase per gli ultimi 30 articoli
        console.log("🟢 [SERVICE] Avvio del listener in tempo reale per gli ultimi 30 articoli.");
        //const recent10Query = query(colRef, orderBy('dataArticolo', 'desc'), limit(30)); // Ascolto solo gli ultimi 30 articoli
        const recent10Query = query(colRef, orderBy('dataArticolo', 'desc')); // Ascolto tutti gli articoli
        unsubscribeFromFirestore = onSnapshot(
            recent10Query,
            async (querySnapshot) => {
                console.log(`🔵 [FIRESTORE READS] onSnapshot ha letto ${querySnapshot.size} documenti.`);

                for (const change of querySnapshot.docChanges()) {
                    const doc = change.doc;
                    const data = doc.data();

                    const articleDoc = {
                        id: doc.id,
                        categoria: data?.categoria ?? 'Categoria non disponibile',
                        autore: "Oscar Prata",
                        titolo: data?.titolo ?? 'Titolo non disponibile',
                        sintesi: data?.sintesi ?? 'Non disponibile',
                        puntiChiave: data?.puntiChiave ?? [],
                        dataArticolo: data?.dataArticolo instanceof Timestamp ? data.dataArticolo.toDate().toISOString() : new Date().toISOString(),
                        isDeleteDisabled: data?.isDeleteDisabled ?? false,
                        contenuto: data.paragrafi ? data.paragrafi.map((p) => p.contenuto).join(' ') : 'N/A',
                        immagine: data?.immagine ?? 'Immagine non disponibile',
                        indice: Array.isArray(data?.indice) ? data.indice : ['Indice non disponibile'],
                        metaDescription: data?.metaDescription ?? 'Meta description non disponibile',
                        slug: data?.slug ?? 'Slug non disponibile',
                        sottotitolo: data?.sottotitolo ?? 'Sottotitolo non disponibile',
                        paragrafi: data.paragrafi ? data.paragrafi.map((par) => ({
                            immagine: par.immagine ?? 'Immagine non disponibile',
                            titoloParagrafo: par.titoloParagrafo ?? 'Titolo paragrafo non disponibile',
                            contenuto: par.contenuto ?? 'Contenuto non disponibile'
                        })) : [],
                        titoloSeo: data?.titoloSeo ?? 'Titolo SEO non disponibile',
                        parolaChiave: data?.parolaChiave ?? 'Parola chiave non disponibile',
                        punteggioSEO: data?.punteggioSEO ?? '',
                        faq: Array.isArray(data.faq) ? data.faq.map((faqItem) => ({
                            domanda: faqItem.domanda ?? 'Domanda non disponibile',
                            risposta: faqItem.risposta ?? 'Risposta non disponibile'
                        })) : []
                    };

                    if (change.type === 'added' || change.type === 'modified') {
                        await savePublished([articleDoc]);
                    }
                    if (change.type === 'removed') {
                        await deletePublished(articleDoc.id);
                    }
                }
                console.log(`📦 [DEXIE] Cache aggiornata con l'ultimo snapshot.`);
            },
            (error) => {
                console.error('❌ [Firestore] Errore in onSnapshot():', error);
            }
        );

    } catch (err) {
        console.error("🔴 [FETCH ERROR] Errore nel caricamento iniziale:", err);
    }
};

export const stopArticlesSync = () => {
    if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore();
        console.log("🛑 [FIRESTORE CLEANUP] Servizio di sincronizzazione articoli disiscritto.");
        unsubscribeFromFirestore = null;
        isSyncStarted = false;
    }
};
