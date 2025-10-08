import ModalFailure from "../../components/ModalFailure";
import React from "react";
import { useDispatch } from "react-redux";
import { closeSendArticleModal } from "/src/reducer/features/ModalSlice";

// Modal per l'insuccesso durante l'invio dell'articolo
const ModalFailureSendArticle = () => {
    const dispatch = useDispatch();
    return (
        <ModalFailure
            primaryText="Articolo non inviato"
            secondaryText="Tutti i campi sono obbligatori. Ti chiediamo di controllare tutti i campi e riprovare ad inviare l'articolo."
            textPrimaryButtonModal="Chiudi"
            textSecondaryButtonModal="Dashboard"
            onClickPrimary={() => dispatch(closeSendArticleModal())}
            onClickSecondary={() => dispatch(closeSendArticleModal())}
        />
    );
};

export default ModalFailureSendArticle;
