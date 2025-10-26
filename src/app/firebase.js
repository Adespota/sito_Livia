// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
    getFirestore,
    enableIndexedDbPersistence,
    serverTimestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// ✅ Configurazione dal file .env
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🧩 Inizializza l’app una sola volta
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔐 Auth
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

// 💾 Realtime Database
const database = getDatabase(app);

// 🔥 Firestore
const firestore = getFirestore(app);

// 🔄 Abilita persistence offline (async-safe)
(async () => {
    try {
        await enableIndexedDbPersistence(firestore);
        console.log("✅ Firestore persistence abilitata");
    } catch (err) {
        if (err.code === "failed-precondition") {
            console.warn("⚠️ Persistence disabilitata: app aperta in un'altra scheda.");
        } else if (err.code === "unimplemented") {
            console.warn("⚠️ Persistence non supportata da questo browser.");
        } else {
            console.error("❌ Errore durante l'attivazione della persistence:", err);
        }
    }
})();

// 📦 Storage
const storage = getStorage(app);

// ⚙️ Cloud Functions
const functions = getFunctions(app);

// 🧩 Export nominativi (ufficiali Firebase)
export {
    app,
    auth,
    googleAuthProvider,
    firestore,
    storage,
    database,
    functions,
    serverTimestamp,
    httpsCallable,
};

// 🌍 Export di default (comodo per import globale)
const firebase = {
    app,
    auth,
    firestore,
    storage,
    database,
    functions,
};

export default firebase;




// Info utili per usare la configurazione di firebase.js che ho creato:
// per usare firestore in qualsiasi punto del codice è sufficiente importare in questo modo:
// import { firestore } from "@/app/firebase";
