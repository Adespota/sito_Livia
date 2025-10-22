
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

import firebase from '@/app/firebase';
const auth = firebase.auth;

/**
 * Hook personalizzato per richiedere l'autenticazione.
 * Monitora lo stato di Firebase e reindirizza a /login se l'utente non è autenticato.
 * @returns {object} { user: oggetto Firebase User o null, loading: boolean }
 */
export const useRequireAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verifica che siamo nel browser
        if (typeof window === 'undefined') {
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                // Utente non autenticato: imposta lo stato e reindirizza
                setUser(null);
                setLoading(false);
                router.push('/login');
            } else {
                // Utente autenticato: imposta l'utente e termina il caricamento
                setUser(firebaseUser);
                setLoading(false);
            }
        });

        // Cleanup del listener quando il componente si smonta
        return () => unsubscribe();
    }, [router]);

    // Ritorna lo stato dell'autenticazione
    return { user, loading, isAuthenticated: !!user };
};
