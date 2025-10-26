import { collection, query, onSnapshot } from 'firebase/firestore';
import firebase from '../../src/app/firebase'
import { syncCategories, getCategories } from '@/app/dexie';
import * as domainLib from '@tuoorg/domain-lib';



// Sentinella a livello di modulo per garantire l'esecuzione singola
let isSyncStarted = false;
let unsubscribeFromFirestore = null;





export const startCategorySync = async (dispatch) => {
    const firestore = firebase.firestore;
    const setCategory = domainLib.articolo.setCategory;
    const setCategoryPageBlog = domainLib.articlesBlog.setCategoryPageBlog;

    // Se la sincronizzazione è già attiva, non fare nulla
    if (isSyncStarted) {
        return;
    }

    console.log("🟡 [SERVICE] Avvio del servizio di sincronizzazione categorie...");
    isSyncStarted = true;

    try {
        // Caricamento iniziale da Dexie per render veloce
        const localCategories = await getCategories();
        if (localCategories.length > 0) {
            dispatch(setCategory(localCategories));
            dispatch(setCategoryPageBlog(localCategories));
            console.log("🟢 [DEXIE] Dati caricati inizialmente da Dexie.");
        }

        // Avvia l'ascoltatore di Firebase
        const categoriesRef = collection(firestore, 'categorie');
        const q = query(categoriesRef);

        unsubscribeFromFirestore = onSnapshot(q, async (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log(`🔵 [FIRESTORE READS] onSnapshot ha letto ${querySnapshot.docs.length} documenti.`);

            await syncCategories(data);
            dispatch(setCategory(data));
            dispatch(setCategoryPageBlog(data));
            console.log("✅ [REDUX UPDATE] Stato Redux aggiornato da Firebase.");
        }, (err) => {
            console.error("🔴 [FIRESTORE ERROR] Errore nel servizio di sincronizzazione:", err);
        });

    } catch (err) {
        console.error("🔴 [FETCH ERROR] Errore nel caricamento iniziale:", err);
    }
};

export const stopCategorySync = () => {
    if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore();
        console.log("🛑 [FIRESTORE CLEANUP] Servizio di sincronizzazione disiscritto.");
        unsubscribeFromFirestore = null;
        isSyncStarted = false;
    }
};
