import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const login = async (email, password) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
};
