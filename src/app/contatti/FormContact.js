'use client';

import React, { useState } from "react";
import Input from "../components/Input";
import { Button } from "@adespota/my-react-component";
import { functions, httpsCallable } from "@/app/firebase";
import { Switch } from '@headlessui/react';
import classNames from "/src/utils/classNames";
import { openContactModal, selectModalTypeContact, selectShowContactModal } from "/src/reducer/features/ModalSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalFailureContact from "./ModalFailureContact";
import ModalSuccessContact from "./ModalSuccessContact";
import {backgroundButtonStyle} from "@/styles/constants";



export default function FormContact() {
    const dispatch = useDispatch();
    const showComponent = useSelector(selectShowContactModal);
    const modalType = useSelector(selectModalTypeContact);

    // Stato del modulo
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        email: '',
        messaggio: ''
    });
    const [emailError, setEmailError] = useState('');
    const [agreed, setAgreed] = useState(false);

    // Tipo di modali
    const MODAL_TYPE_FAILURE = 'failure';
    const MODAL_TYPE_SUCCESS = 'success';

    // Gestisce il cambiamento nel campo del messaggio
    const handleMessageChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            messaggio: e.target.value,
        }));
    };

    // Gestisce l'invio dell'email
    const handleSendEmail = () => {
        // Controlla se tutti i campi sono validi e se l'utente ha accettato i termini
        if (!formData.nome || !formData.cognome || !formData.email || !formData.messaggio || !agreed || emailError) {
            console.error("All fields are required and you must accept the terms and conditions");
            dispatch(openContactModal({ modalTypeContact: MODAL_TYPE_FAILURE }));
            return;
        }

        // Funzione per inviare l'email
        const sendEmailFunction = httpsCallable(functions, 'sendEmailGeneric');

        sendEmailFunction(formData)
            .then((result) => {
                console.log(result);
                dispatch(openContactModal({ modalTypeContact: MODAL_TYPE_SUCCESS }));
            })
            .catch((err) => {
                console.error(err);
                dispatch(openContactModal({ modalTypeContact: MODAL_TYPE_FAILURE }));
            });
    };

    // Gestisce il cambiamento nel campo dell'email e valida l'email
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setFormData((prevData) => ({
            ...prevData,
            email: emailValue
        }));
        if (!emailValidationRegex.test(emailValue)) {
            setEmailError('Inserisci un email valida.');
        } else {
            setEmailError('');
        }
    };



 return (
        <div className="flex flex-col sm:p-7 p-4 rounded-2xl bg-white">
            {/* Intestazione del modulo */}
            <div className="text-left space-y-1 mb-6">
                <p className="text-[1.145rem] font-semibold mb-1">Contatti</p>
                <p>Per qualsiasi domanda puoi contattarci compilando la form oppure utilizzando i contatti diretti che trovi in questa pagina.</p>
            </div>
            {/* Campi di input */}
            <div className="flex flex-col sm:space-y-5 space-y-4">
                <div className="flex w-full space-x-4 items-center">
                    <Input
                        placeholder="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="flex-1"
                    />
                    <Input
                        placeholder="Cognome"
                        name="cognome"
                        value={formData.cognome}
                        onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                        className="flex-1"
                    />
                </div>
                <div>
                    <Input
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                    />
                    {emailError && (
                        <div className="text-red-500 text-sm font-semibold pt-1">
                            {emailError}
                        </div>
                    )}
                </div>
                <Input
                    placeholder="Messaggio"
                    name="messaggio"
                    multiline={true}
                    rows={9}
                    value={formData.messaggio}
                    onChange={handleMessageChange}
                />
            </div>
            {/* Checkbox per accettare i termini */}
            <div className="flex items-center space-x-2 mt-4">
                <Switch
                    checked={agreed}
                    onChange={setAgreed}
                    className={classNames(
                        agreed ? 'bg-myColor-default' : 'bg-gray-200',
                        'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out'
                    )}
                >
                    <span className="sr-only">Agree to policies</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            agreed ? 'translate-x-3.5' : 'translate-x-0',
                            'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                        )}
                    />
                </Switch>
                <p className="text-sm">
                    Accetto <a href="/" className="text-blue-600">termini e condizioni</a>
                </p>
            </div>

            <div className="flex justify-end mt-4 w-full">
                <div className="sm:justify-end w-full sm:w-auto">
                    <Button
                        buttonTextDesktop="Invia"
                        onClick={handleSendEmail}
                        backgroundColor={backgroundButtonStyle }
                        className="w-full"
                    />
                </div>
            </div>

            {/* Mostra i modali di successo o fallimento */}
            {showComponent && modalType === MODAL_TYPE_FAILURE ? (
                <ModalFailureContact />
            ) : modalType === MODAL_TYPE_SUCCESS ? (
                <ModalSuccessContact />
            ) : null}

        </div>
    );
}
