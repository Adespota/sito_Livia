import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    serverTimestamp,
    initializeFirestore,
    persistentLocalCache,
    CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

// Auth
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

// Realtime Database
const database = getDatabase(app);

// Storage
const storage = getStorage(app);

// Functions
const functions = getFunctions(app); // <--- Istanza creata

// Firestore: con configurazione di cache
const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
        synchronizeTabs: true,
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
});

// 5. Esportazioni: Aggiunta di 'functions' alla lista delle esportazioni nominate
export { serverTimestamp, httpsCallable, googleAuthProvider, functions }; // ⭐ CORREZIONE QUI

// Esportazione del singolo oggetto contenente tutte le istanze per un accesso pulito.
const firebase = {
    app,
    auth,
    database,
    firestore,
    storage,
    functions,
};

export default firebase;
