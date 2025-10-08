import { createSlice } from "@reduxjs/toolkit";

const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export const loginSlice = createSlice({
    name: "login",
    initialState: {
        email: "",
        password: "",
        emailError: "", // Stato per l'errore dell'email
        passwordError: "", // Stato per l'errore della password
        passwordVisible: false, // Stato la visibilità della password
    },
    reducers: {
        setInput: (state, action) => {
            const { fieldName, value } = action.payload;
            return {
                ...state,
                [fieldName]: value,
            };
        },
        setEmailValidation: (state, action) => {
            const { value } = action.payload;
            state.email = value;
            state.emailError = isEmailValid(value) ? "" : "Email non valida";
        },
        setPasswordValidation: (state, action) => {
            const { value } = action.payload;
            state.password = value;
            state.passwordError = value.length >= 8 ? "" : "La password deve contenere almeno 8 caratteri";
        },
        togglePasswordVisibility: (state) => {
            state.passwordVisible = !state.passwordVisible;
        },

    },
});

// Estrai le azioni create
export const {
    setEmailValidation,
    setPasswordValidation,
    togglePasswordVisibility,
} = loginSlice.actions;

// Seleziona parti dello stato
export const selectEmail = (state) => state.login.email;
export const selectPassword = (state) => state.login.password;
export const selectEmailError = (state) => state.login.emailError;
export const selectPasswordError = (state) => state.login.passwordError;
export const selectPasswordVisible = (state) => state.login.passwordVisible;

// Esporta il reducer
export default loginSlice.reducer;
