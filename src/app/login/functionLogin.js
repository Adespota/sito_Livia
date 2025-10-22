import { signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '@/app/firebase';
const auth = firebase.auth;


export const login = async (email, password) => {
    // Usa l'istanza 'auth' già disponibile
    return signInWithEmailAndPassword(auth, email, password);
};
