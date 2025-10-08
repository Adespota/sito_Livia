"use client";

import React, { useState, useCallback, useEffect } from "react";
import Input from "../../components/Input";
import DragAndDropImage from "../../components/DragAndDropImage";
import HeroIcon from "../../components/HeroIcons";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { auth, firestore } from "@/app/firebase";
import {showSnackbar} from "@/reducer/features/snackBarSlice";
import {useDispatch} from "react-redux";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";



export default function Page() {
    const [activeTab, setActiveTab] = useState("generale");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();
    const user = auth.currentUser;
    console.log("Oggetto user", user);
    const [abbonamento, setAbbonamento] = useState(null);




    useEffect(() => {
        if (!user?.uid) return;

        const fetchSubscription = async () => {
            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userSnap   = await getDoc(userDocRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setAbbonamento(data.abbonamento ?? null);
                } else {
                    console.warn('Nessun documento utente trovato per', user.uid);
                }
            } catch (err) {
                console.error('Errore leggendo l’abbonamento:', err);
            }
        };

        fetchSubscription();
    }, [user?.uid]);




    useEffect(() => {
        if (user?.displayName) {
            const [first = "", ...rest] = user.displayName.split(" ");
            setFirstName(first);
            setLastName(rest.join(" "));
        }
    }, [user]);


    const handleSaveName = useCallback(async () => {
        if (!user) {
            dispatch(showSnackbar({ message: "Devi effettuare prima l'accesso", type: "error" }));
            return;
        }
        try {
            await updateProfile(user, {
                displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
            });
            const userDoc = doc(firestore, "users", user.uid);
            await updateDoc(userDoc, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });
            dispatch(showSnackbar({ message: "Nome e cognome aggiornati con successo", type: "success" }));
        } catch (err) {
            console.error("Errore nome/cognome:", err);
            dispatch(showSnackbar({ message: "Si è verificato un errore riprova", type: "error" }));
        }
    }, [user, firstName, lastName]);

    const handleChangePassword = useCallback(async () => {
        if (!user) {
            alert("Devi essere loggato");
            return;
        }
        if (!currentPwd || !newPwd || !confirmPwd) {
            dispatch(showSnackbar({ message: "Compila tutti i campi", type: "error" }));
            return;
        }
        if (newPwd !== confirmPwd) {
            dispatch(showSnackbar({ message: "La nuova password e la conferma non corrispondo", type: "error" }));
            return;
        }

        try {
            if (!user.email) {
                dispatch(showSnackbar({ message: "Nessuna email associata all'utente", type: "error" }));
                return;
            }
            const credential = EmailAuthProvider.credential(user.email, currentPwd);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPwd);
            dispatch(showSnackbar({ message: "Password aggiornata con successo", type: "success" }));
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
        } catch (err) {
            console.error("Errore cambio password:", err);
            if (err.code === "auth/wrong-password") {
                dispatch(showSnackbar({ message: "La password corrente non è corretta", type: "error" }));
            } else if (err.code === "auth/weak-password") {
                dispatch(showSnackbar({ message: "La password deve essere di almeno 8 caratteri", type: "error" }));
            } else if (err.code === "auth/requires-recent-login") {
                dispatch(showSnackbar({ message: "Devi aver effettuato il login di recente. Rilogga e riprova.", type: "error" }));
            } else {
                dispatch(showSnackbar({ message: "Si è verificato un errore", type: "error" }));
            }
        }
    }, [user, currentPwd, newPwd, confirmPwd]);

    return (
        <>
            <h6 className="ml-2 mb-4">Impostazioni</h6>
            <div className="flex flex-row space-x-4 mb-5">
                <p
                    onClick={() => setActiveTab("generale")}
                    className={`cursor-pointer ${activeTab === "generale" ? "font-bold" : ""}`}>
                    Generale
                </p>
                <p
                    onClick={() => setActiveTab("abbonamento")}
                    className={`cursor-pointer ${activeTab === "abbonamento" ? "font-bold" : ""}`}>
                    Abbonamento
                </p>
                <p
                    onClick={() => setActiveTab("sicurezza")}
                    className={`cursor-pointer ${activeTab === "sicurezza" ? "font-bold" : ""}`}>
                    Sicurezza
                </p>
            </div>

            <div className="space-y-2">
                {activeTab === "generale" && (
                    <>
                        <div className="rounded-2xl bg-white px-4 py-4 space-y-5">
                            <div className="flex md:flex-row flex-col w-full sm:items-center items-start sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
                                <div className="flex flex-col sm:w-auto w-full items-start">
                                    <p className="font-semibold">Nome e cognome</p>
                                    <p>Puoi modificare i tuoi dati anagrafici</p>
                                </div>
                                <div className="flex sm:flex-grow sm:justify-center justify-start w-full">
                                    <div className="sm:w-1/2 w-full space-y-1.5">
                                        <Input
                                            placeholder="Il tuo nome"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Il tuo cognome"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:flex w-full sm:justify-end">
                                <Button
                                    buttonTextDesktop="Salva"
                                    onClick={handleSaveName}
                                    backgroundColor={backgroundButtonStyle }
                                    textStyle={textButtonStyle}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white px-4 py-4">
                            <div className="flex sm:flex-row flex-col w-full items-center sm:space-x-2 space-x-0 space-y-2 sm:space-y-0">
                                <div className="flex flex-col sm:w-auto w-full items-start">
                                    <p className="font-semibold">Immagine profilo</p>
                                    <p>Puoi cambiare l&apos;immagine del profilo</p>
                                </div>
                                <div className="flex sm:flex-grow sm:justify-center justify-start w-full">
                                    <div className="sm:w-1/2 w-full space-y-1.5 sm:space-y-0">
                                        <DragAndDropImage
                                            onFileAccepted={(file) => console.log("File selezionato:", file)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "abbonamento" && (
                    <>
                        <div className="rounded-2xl bg-white px-4 py-4">
                            <div className="flex md:flex-row flex-col w-full items-center sm:space-x-2 space-x-0 space-y-2">
                                <div className="flex flex-col w-1/2 items-start">
                                    <p className="font-semibold">Il tuo piano attuale</p>
                                    <p>Puoi decidere di modificare il tuo piano</p>
                                </div>
                                <div className="flex sm:flex-grow sm:justify-center justify-start w-full">
                                    <div className="sm:w-1/2 w-full space-y-2">
                                        <Input
                                            placeholder="Il tuo piano"
                                            value={abbonamento}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-4">
                            <div className="flex md:flex-row flex-col w-full items-center sm:space-x-2 space-x-0 space-y-2">
                                <div className="flex flex-col w-1/2  items-start">
                                    <p className="font-semibold">Il tuo indirizzo email</p>
                                    <p>Email che hai attivato per SeoLO IA</p>
                                </div>
                                <div className="flex sm:flex-grow sm:justify-center justify-start w-full">
                                    <div className="sm:w-1/2 w-full space-y-2">
                                        <Input
                                            placeholder="Email"
                                            value={user.email}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>


                )}

                {activeTab === "sicurezza" && (
                    <div className="rounded-2xl bg-white px-4 py-4">
                        <div className="flex md:flex-row flex-col w-full sm:space-x-2 space-x-0 space-y-2 sm:space-y-0">
                            <div className="flex w-full flex-col sm:w-auto items-start">
                                <p className="font-semibold">Password</p>
                                <p>Puoi modificare la tua password qui</p>
                            </div>
                            <div className="sm:flex-grow w-full flex sm:justify-center">
                                <div className="sm:w-1/2 w-full space-y-2">
                                    <div className="relative">
                                        <Input
                                            placeholder="Password corrente"
                                            type={showCurrent ? "text" : "password"}
                                            value={currentPwd}
                                            onChange={(e) => setCurrentPwd(e.target.value)}
                                            className="with-icon"
                                        />
                                        <span
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowCurrent(!showCurrent)}>
                                            <HeroIcon icon={showCurrent ? EyeIcon : EyeSlashIcon} className="h-5 w-5 text-gray-600" />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            placeholder="Nuova password"
                                            type={showNew ? "text" : "password"}
                                            value={newPwd}
                                            onChange={(e) => setNewPwd(e.target.value)}
                                            className="with-icon"
                                        />
                                        <span
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowNew(!showNew)}>
                                            <HeroIcon icon={showNew ? EyeIcon : EyeSlashIcon} className="h-5 w-5 text-gray-600" />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            placeholder="Conferma nuova password"
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPwd}
                                            onChange={(e) => setConfirmPwd(e.target.value)}
                                            className="with-icon"
                                        />
                                        <span
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirm(!showConfirm)}>
                                            <HeroIcon icon={showConfirm ? EyeIcon : EyeSlashIcon} className="h-5 w-5 text-gray-600" />
                                        </span>
                                    </div>
                                    <Button
                                        buttonTextDesktop="Salva password"
                                        backgroundColor={backgroundButtonStyle }
                                        textStyle={textButtonStyle}
                                        onClick={handleChangePassword}
                                        className="mt-2 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
