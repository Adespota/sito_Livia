import React from "react";
import ModalFailure from "../components/ModalFailure";
import { closeLoginModal } from "/src/reducer/features/ModalSlice";
import { useDispatch,  } from "react-redux";



export default function ModalFailureLogin () {
    const dispatch = useDispatch();

    return (
        <ModalFailure
            primaryText={"Accesso non effettuato"}
            secondaryText={"L'accesso alla tua area personale non è andato a buon fine. Ti chiediamo di riprovare!"}
            textPrimaryButtonModal="Vai alla Home"
            textSecondaryButtonModal="Cancella"
            linkPrimary="/"
            onClickSecondary={() => {dispatch(closeLoginModal());}}
        />
    );
}



