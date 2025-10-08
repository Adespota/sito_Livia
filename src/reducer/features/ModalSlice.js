import {createSlice} from "@reduxjs/toolkit";


// Questo slice gestisce la logica di apertura e chiusura delle modali
export const modalSlice = createSlice({
    name: 'modal',
    origin: null,
    initialState: {
        showLoginModal: false,
        showArticleModal: false,
        showContactModal: false,
        showPubblicArticleModal: false,
        showSaveArticoloBozzaModal: false,
        showSavedArticleModalPubblished: false,
        showSendPaymentModal: false,
        showPaymentModal: false,
        showRegistrationNewsLetterModal: false,
        showRecuperaPasswordModal: false,


        //Succes,Failure
        modalTypeLogin: null,
        modalTypeArticle: null,
        modalTypeContact: null,
        modalTypeArticlePubblic: null,
        modalTypeBozzaArticolo: null,
        modalTypeSalvaArticoloPubblicato: null,
        modalTypeSendPayment: null,
        modalTypePayment: null,
        modalTypeRegistrationNewsLetter: null,
        modalTypeRecuperaPassword: null,
    },
    reducers: {
        openRegistrationModal: (state, action) => {
            state.showRegistrationModal = true;
            state.modalTypeRegistration = action.payload.modalTypeRegistration;
        },
        closeRegistrationModal: (state, action) => {
            state.showRegistrationModal = false;
            state.modalTypeRegistration = null;
        },
        openLoginModal: (state, action) => {
            state.showLoginModal = true;
            state.modalTypeLogin = action.payload.modalTypeLogin;
            state.origin = action.payload.origin;
        },
        closeLoginModal: (state, action) => {
            state.showLoginModal = false;
            state.modalTypeLogin = null;
            state.origin = null;
        },
        openSendArticleModal: (state, action) => {
            console.log('openSendArticleModal reducer called: ', action);
            state.showArticleModal = true;
            state.modalTypeArticle = action.payload.modalTypeArticle;
        },
        closeSendArticleModal: (state, action) => {
            state.showArticleModal = false;
            state.modalTypeArticle = null;
        },
        openPubblicArticleModal: (state, action) => {
            state.showPubblicArticleModal = true;
            state.modalTypeArticlePubblic = action.payload.modalTypeArticlePubblic;
        },
        closePubblicArticleModal: (state, action) => {
            state.showPubblicArticleModal = false;
            state.modalTypeArticlePubblic = null;
        },
        openBozzaArticoloModal: (state, action) => {
            state.showSaveArticoloBozzaModal = true;
            state.modalTypeBozzaArticolo = action.payload.modalTypeBozzaArticolo;
        },
        closeBozzaArticoloModal: (state, action) => {
            state.showSaveArticoloBozzaModal = false;
            state.modalTypeBozzaArticolo= null;
        },
        openSalvaArticoloModal: (state, action) => {
            state.showSavedArticleModalPubblished = true;
            state.modalTypeSalvaArticoloPubblicato = action.payload.modalTypeSalvaArticoloPubblicato;
        },
        closeSalvaArticoloModal: (state, action) => {
            state.showSavedArticleModalPubblished = false;
            state.modalTypeSalvaArticoloPubblicato = null;
        },
        openContactModal: (state, action) => {
            state.showContactModal = true;
            state.modalTypeContact = action.payload.modalTypeContact;
            state.origin = action.payload.origin;
        },
        closeContactModal: (state, action) => {
            state.showContactModal = false;
            state.modalTypeContact = null;
            state.origin = null;
        },
        openPaymentCashModal: (state, action) => {
            state.showPaymentModal = true;
            state.modalTypePayment = action.payload.modalTypePayment;
        },
        closePaymentCashModal: (state, action) => {
            state.showPaymentModal = false;
            state.modalTypePayment = null;
        },
        openRecuperaPasswordModal: (state, action) => {
            state.showRecuperaPasswordModal = true;
            state.modalTypeRecuperaPassword = action.payload.modalTypeRecuperaPassword;
        },
        closeRecuperaPasswordModal: (state,) => {
            state.showRecuperaPasswordModal = false;
            state.modalTypeRecuperaPassword = null;
        },
        openRegistrationNewsLetterModal: (state, action) => {
            state.showRegistrationNewsLetterModal = true;
            state.modalTypeRegistrationNewsLetter = action.payload.modalTypeRegistrationNewsLetter;
        },
        closeRegistrationNewsLetterModal: (state, action) => {
            state.showRegistrationNewsLetterModal = false;
            state.modalTypeRegistrationNewsLetter = null;
        },



        resetModalState: (state) => {
            state.showPrenotationModal = false;
            state.modalTypePrenotation = null;
            state.showRegistrationModal = false;
            state.modalTypeRegistration = null;
            state.showLoginModal = false;
            state.modalTypeLogin = null;
            state.showContactModal = false;
            state.modalTypeContact = null;
            state.showArticleModal = false;
            state.modalTypeArticle = null;
            state.showPubblicArticleModal = false;
            state.modalTypeArticlePubblic = null;
            state.showSaveArticoloBozzaModal = false;
            state.modalTypeBozzaArticolo = null;
            state.showSavedArticleModalPubblished = false;
            state.modalTypeSalvaArticoloPubblicato = null;
            state.showSendPaymentModal = false;
            state.modalTypeSendPayment = null;
            state.showUploadFileModal = false;
            state.modalTypeUploadFile = null;
            state.showPaymentModal = false;
            state.modalTypePayment = null;
            state.showRegistrationNewsLetterModal = false;
            state.modalTypeRegistrationNewsLetter = null;
            state.showReminderPaymentModal = false;
            state.modalTypeReminderPayment = null;
        },
    }
});

// Estrai le azioni create
export const {
    openLoginModal,
    closeLoginModal,
    openContactModal,
    closeContactModal,
    openPaymentCashModal,
    closePaymentCashModal,
    openSendArticleModal,
    openPubblicArticleModal,
    openBozzaArticoloModal, // Azione che fa aprire la modale che compare al salvataggio dell'articolo
    closeBozzaArticoloModal, // Azione per chiudere la modale che di apre dopo aver slavato l'articolo
    closePubblicArticleModal,
    openSalvaArticoloModal,
    closeSalvaArticoloModal,
    closeSendArticleModal,
    openRecuperaPasswordModal,
    closeRecuperaPasswordModal,
} = modalSlice.actions;


export const selectShowLoginModal = (state) => state.modal.showLoginModal;
export const selectShowContactModal = (state) => state.modal.showContactModal;
export const selectShowArticleModal = (state) => state.modal.showArticleModal;
export const selectShowPubblicArticle = (state) => state.modal.showPubblicArticleModal;
export const selectShowBozzaArticolo = (state) => state.modal.showSaveArticoloBozzaModal;
export const selectShowSaveArticoloPubblicato = (state) => state.modal.showSavedArticleModalPubblished;
export const selectShowCashPayment = (state) => state.modal.showPaymentModal;
export const selectShowRecuperaPassword = (state) => state.modal.showRecuperaPasswordModal;



export const selectModalTypeLogin = (state) => state.modal.modalTypeLogin;
export const selectModalTypeArticle = (state) => state.modal.modalTypeArticle;
export const selectModalTypePubblicArticle = (state) => state.modal.modalTypeArticlePubblic;
export const selectModalTypeBozzaArticolo = (state) => state.modal.modalTypeBozzaArticolo;
export const selectModalTypeSalvaArticoloPubblicato = (state) => state.modal.modalTypeSalvaArticoloPubblicato;
export const selectModalTypeCashPayment = (state) => state.modal.modalTypePayment;
export const selectModalOrigin = (state) => state.modal.origin;
export const selectModalTypeRecuperaPassword = (state) => state.modal.modalTypeRecuperaPassword
export const selectModalTypeContact = (state) => state.modal.modalTypeContact;



export default modalSlice.reducer;
