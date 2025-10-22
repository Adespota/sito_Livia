
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './features/ModalSlice';
import loginReducer from './features/loginSlice';
import chatGeminiReducer from "./features/chatGeminiSlice";
import auditSlice from "./features/auditSlice";
import userSlice from "./features/user";
import {
    articoloSlice,
    articlesBlogSlice,
    snackbarSlice,
} from "@adespota/my-react-component";



export const store = configureStore({
    reducer: {
        user: userSlice,
        auditSlice: auditSlice,
        modal: modalReducer,
        login: loginReducer,
        chatGemini: chatGeminiReducer,
        articolo: articoloSlice.reducer,
        articles: articlesBlogSlice.reducer,
        snackBarSlice: snackbarSlice.reducer,
    },
});

export default store;
