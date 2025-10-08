
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeFirestore, persistentLocalCache, CACHE_SIZE_UNLIMITED } from "firebase/firestore";



// Configurazione dell'app Firebase tramite variabili d'ambiente
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


// Inizializzazione dell'app Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig); // Inizializza Firebase se non è già inizializzato
} else {
    app = getApps()[0]; // Se Firebase è già inizializzato, usa l'istanza esistente
}



// Ottenere l'istanza di Firebase Functions ed esportarla per l'uso
const functions = getFunctions(app);
export { functions, httpsCallable, getFunctions };

// Ottenere l'istanza di Firebase Authentication ed esportarla per l'uso
const auth = getAuth(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider };

// Ottenere l'istanza di Realtime Database ed esportarla per l'uso
const database = getDatabase(app);
export { database }; // Esportare Realtime Database


// Inizializza Firestore con una configurazione che include la persistenza e la dimensione della cache
const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
        synchronizeTabs: true, // Consente la persistenza offline su più schede del browser
        cacheSizeBytes: CACHE_SIZE_UNLIMITED // Configura la cache senza limiti di dimensione
    })
});
export { firestore, serverTimestamp }; // Esportare Firestore e serverTimestamp

// Ottenere un riferimento all'istanza di Firebase Storage (per immagini e file)
const storage = getStorage(app);
export { storage }; // Esportare Firebase Storage


// Esportazione dell'intero oggetto Firebase per un facile utilizzo
const firebase = {
    app,
    functions,
    auth,
    database,
    firestore,
    storage,
    httpsCallable,
    serverTimestamp,
};
export { firebase };
