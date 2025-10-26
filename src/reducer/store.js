import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './features/ModalSlice';
import loginReducer from './features/loginSlice';
import chatGeminiReducer from './features/chatGeminiSlice';
import auditReducer from './features/auditSlice';
import userReducer from './features/user';
import { articoloReducer, articlesBlogReducer, snackbarReducer } from '@tuoorg/domain-lib';

export const store = configureStore({
    reducer: {
       // Arrivano dalla libreria 'libreria_redux'
        articolo: articoloReducer,
        articles: articlesBlogReducer,
        snackbar: snackbarReducer,

        // tuoi
        user: userReducer,
        audit: auditReducer,
        modal: modalReducer,
        login: loginReducer,
        chatGemini: chatGeminiReducer,
    },
});

export default store;
