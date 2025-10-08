import{configureStore} from '@reduxjs/toolkit'
import modalReducer from './features/ModalSlice' // Reducer per gestire le modali
import registrazioneReducer from  './features/registrazioneSlice' // Reducer per gestire la registration utente
import loginReducer from './features/loginSlice' // Reducer per gestire la login dell'utente
import articoloReducer from './features/articoloSlice' // Reducer per l'articolo
import articlesReducer from "./features/articleBlogSlice";
import carrelloReducer from "./features/carrelloSlice"
import sendReminderSliceReducer from "./features/sendReminderSlice";
import snackBarSliceReducer from "./features/snackBarSlice";
import chatGeminiReducer from "./features/chatGeminiSlice";
import auditSlice from "./features/auditSlice";
import user from "./features/user";



export const store = configureStore({
    reducer: {
        user: user,
        modal: modalReducer,
        registrazione: registrazioneReducer,
        login: loginReducer,
        articolo: articoloReducer,
        articles: articlesReducer,
        carrello: carrelloReducer,
        sendReminder: sendReminderSliceReducer,
        snackBarSlice: snackBarSliceReducer,
        chatGemini: chatGeminiReducer,
        auditSlice: auditSlice,
        // Altri reducer, se presenti...
    },
});

export default store;
