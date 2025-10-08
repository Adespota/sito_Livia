import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();


export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user; // Restituisci l'utente in caso di successo
    } catch (error) {
        throw error; // Solleva l'errore per gestirlo altrove
    }
};