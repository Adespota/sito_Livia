import ModalSuccess from "../../components/ModalSuccess";
import React from "react";
import { useDispatch } from "react-redux";
import {closeSendArticleModal} from "/src/reducer/features/ModalSlice";
import {setSelectedComponent} from "/src/reducer/features/routeSlice";

// Modal per il success dopo l'invio dell'articolo
const ModalSuccessSendArticle = () => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(closeSendArticleModal());
        dispatch(setSelectedComponent('articoli_pubblicati'));
    };

    return (
        <ModalSuccess
            primaryText="Articolo inviato con successo"
            secondaryText="Potrai ora accedere all'app e vedere il tuo articolo pubblicato"
            textPrimaryButtonModal="Chiudi"
            textSecondaryButtonModal="Articoli pubblicati"
            onClickPrimary={() => dispatch(closeSendArticleModal())}
            onClickSecondary={handleClick}
        />
    );
};

export default ModalSuccessSendArticle;
