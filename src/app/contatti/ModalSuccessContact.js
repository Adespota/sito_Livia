import React from "react";
import ModalSuccess from "../components/ModalSuccess";
import {closeContactModal} from "/src/reducer/features/ModalSlice";
import {useDispatch} from "react-redux";





export default function ModalSuccessContact  ()  {
    const dispatch = useDispatch();

    return (
        <ModalSuccess
            primaryText="Richiesta inviata con successo"
            secondaryText="La tua richiesta è stata inviata. Riceverai una risposta nel più breve tempo possibile"
            textPrimaryButtonModal="Ritorna alla Home"
            textSecondaryButtonModal="Chiudi"
            linkPrimary= "/"
            onClickSecondary={() => dispatch(closeContactModal())}
        />
    );
};
