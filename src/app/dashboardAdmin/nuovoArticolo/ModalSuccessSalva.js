import React from "react";
import {closeBozzaArticoloModal} from "/src/reducer/features/ModalSlice";
import {useDispatch} from "react-redux";
import ModalSuccess from "../../components/ModalSuccess";
import {setSelectedComponent} from "/src/reducer/features/routeSlice";

const ModalSuccessSalva = ({ handleArticleRedirect }) => {
    const dispatch = useDispatch();


    const handleClick = () => {
        dispatch(closeBozzaArticoloModal());
        dispatch(setSelectedComponent('articoli_bozze'));
        handleArticleRedirect();
    };


    return (
        <ModalSuccess
            primaryText="Articolo salvato con successo"
            secondaryText="Il tuo articolo è stato salvato con successo!"
            textPrimaryButtonModal="Chiudi"
            textSecondaryButtonModal="Articoli bozze"
            onClickPrimary={() => dispatch(closeBozzaArticoloModal())}
            onClickSecondary={handleClick}
        />
    );
};

export default ModalSuccessSalva;
