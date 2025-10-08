
import {firestore} from "/src/app/firebase";
import {addDoc, collection, getDoc, doc, deleteDoc, updateDoc, query, where, getDocs, setDoc,} from "firebase/firestore";


export const useCrud = () => {
    const db = firestore;

    //Funzione per inviare dati al cloud Firestore
    const addDocument = async (collectionPath, documentData) => {
        try {

            console.log("collectionPath:", collectionPath);
            const collectionRef = collection(db, ...collectionPath);
            console.log("collectionRef.path:", collectionRef.path);

            const nuovoDocumentoRef = await addDoc(collectionRef, documentData);

            console.log(`Documento aggiunto con successo a ${collectionRef.path}/${nuovoDocumentoRef.id}`);
            return nuovoDocumentoRef.id;

        } catch (error) {
            console.error("Errore durante l'aggiunta del documento:", error);
            throw error;
        }
    };


    // Funzione per leggere dati dal cloud Firestore
    const readDocument = async (collectionPath, documentPath) => {
        try {
            if (documentPath) {
                const documentRef = doc(db, ...collectionPath, documentPath);
                const documentSnap = await getDoc(documentRef);

                if (documentSnap.exists()) {
                    console.log(`Documento letto con successo da ${documentRef.path}:`, documentSnap.data());
                    return documentSnap.data();
                } else {
                    console.log(`Documento non trovato a ${documentRef.path}`);
                    return null;
                }
            } else {
                const collectionRef = collection(db, ...collectionPath);
                const querySnapshot = await getDocs(collectionRef);
                const data = [];

                querySnapshot.forEach((doc) => {
                    const documentId = doc.id;
                    console.log(`ID del documento: ${documentId}`);
                    //data.push(documentId);
                    data.push({ id: doc.id, ...doc.data() });
                });


                console.log(`Dati letti dalla collezione ${collectionRef.path}:`, data);
                return data;
            }
        } catch (error) {
            console.error("Errore durante la lettura: ", error);
            throw error;
        }
    };

    // Funzione per eliminare documenti nel cloud Firestore
    const deleteDocument = async (collectionPath, documentPath) => {
        try {
            const documentRef = doc(db, ...collectionPath, documentPath);

            await deleteDoc(documentRef);

            console.log(`Documento cancellato con successo da ${documentRef.path}`);
        } catch (error) {
            console.error("Errore durante la cancellazione del documento:", error);
            throw error;
        }
    };

    // Funzione per aggiornare dati nel cloud Firestore
    const updateDocument = async (collectionPath, documentData) => {
        try {
            const documentRef = doc(db, ...collectionPath);

            await updateDoc(documentRef, documentData);

            console.log(`Documento aggiornato con successo a ${documentRef.path}`);
        } catch (error) {
            console.error("Errore durante l'aggiornamento del documento:", error);
            throw error;
        }
    };




    return { addDocument, readDocument, deleteDocument, updateDocument, };
};


