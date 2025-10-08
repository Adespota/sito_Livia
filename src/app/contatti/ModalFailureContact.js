import React from "react";
import ModalFailure from "../components/ModalFailure";
import {closeContactModal, closeLoginModal, } from "/src/reducer/features/ModalSlice";
import {useDispatch, useSelector} from "react-redux";



export default function ModalFailureContact  ()  {
    const dispatch = useDispatch();


    return (
        <ModalFailure
            primaryText="Tutti i campi sono obbligatori"
            secondaryText="La tua richiesta non è stata inviata. Controlla tutti i campi, inoltre prendi visione e accetta i termini e condizioni"
            textPrimaryButtonModal="Riprova"
            textSecondaryButtonModal="Cancella"
            onClickPrimary={() => {dispatch(closeContactModal());}}
            onClickSecondary={() => dispatch(closeContactModal())}
        />
    );
};
