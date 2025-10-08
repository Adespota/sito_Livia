'use client';

import React, {useEffect} from "react";
import Grid from '@mui/material/Grid';
import {useAuth} from "@/app/authContext";
import ComunicationForUsers from "@/app/components/ComunicationForUsers";
import { useRouter } from 'next/navigation';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {
    clearUser,
    selectIsUserLoading, selectUserDisplayName,
    selectUserFirstName,
    selectUserLastName,
    selectUserUid, setLoading,
    setUser
} from "@/reducer/features/user";
import {useDispatch, useSelector} from "react-redux";
import {doc, onSnapshot} from "firebase/firestore";
import {firestore} from "@/app/firebase";



export default function Page() {
    const dispatch = useDispatch();
    const userDisplayName = useSelector(selectUserDisplayName);
    const user = useAuth();
    const router = useRouter();



    useEffect(() => {
        if (!user || !user.user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user || !user.user) {
        return null;
    }


    useEffect(() => {
        dispatch(setLoading(true));
        const auth = getAuth();

        const unsubAuth = onAuthStateChanged(auth, firebaseUser => {
            if (firebaseUser) {
                const userDocRef = doc(firestore, 'users', firebaseUser.uid);

                const unsubFirestore = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userDataFromFirestore = docSnap.data();
                        dispatch(setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            firstName: userDataFromFirestore.nome || '',
                            lastName: userDataFromFirestore.cognome || '',
                        }));
                        // ✨ LOG HERE after dispatch
                        console.log("Dati utente caricati (useEffect):", {
                            uid: firebaseUser.uid,
                            firstName: userDataFromFirestore.nome,
                            lastName: userDataFromFirestore.cognome
                        });
                    } else {
                        // Utente Auth ma non in Firestore - setta i dati base
                        dispatch(setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            firstName: '',
                            lastName: '',
                        }));
                        // ✨ LOG HERE for new user
                        console.log("Nuovo utente Auth, nessun doc Firestore:", firebaseUser.uid);
                    }
                    dispatch(setLoading(false)); // Imposta loading a false qui, dopo aver gestito i dati
                }, (error) => {
                    console.error("Error fetching user data from Firestore:", error);
                    dispatch(setLoading(false));
                });
                return () => unsubFirestore();

            } else {
                dispatch(clearUser());
                dispatch(setLoading(false)); // Imposta loading a false anche al logout
                // ✨ LOG HERE for logout
                console.log("Utente disconnesso.");
            }
        });

        return () => unsubAuth();
    }, [dispatch]);




    return (
        <>
            <p className="mb-8 sm:text-[1.2rem] text-[1rem] font-bold">Ciao {userDisplayName}</p>
            <Grid container spacing={1}>
                <Grid item xs={12} md={5}>
                    <ComunicationForUsers/>
                </Grid>
            </Grid>
        </>
    );
}
