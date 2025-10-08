import { createSlice } from "@reduxjs/toolkit";

const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export const registrazioneSlice = createSlice({
    name: "registrazione",
    initialState: {
        nome: "",
        cognome: "",
        email: "",
        password: "",
        confermaPassword: "",
        ruolo:"",
        casa:"",
        stripeCustomerId: "",
        emailError: "", // Stato per l'errore dell'email
        passwordError: "", // Stato per l'errore della password
        confermaPasswordError: "", // Stato per l'errore della conferma password
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
            // Aggiungi un controllo extra per non mostrare l'errore se l'email è vuota
            state.emailError = value && !isEmailValid(value) ? "Email non valida" : "";
        },
        setPasswordValidation: (state, action) => {
            const { value } = action.payload;
            state.password = value;
            state.passwordError = value.length >= 8 ? "" : "La password deve contenere almeno 8 caratteri";
        },
        setConfermaPasswordValidation: (state, action) => {
            const { value } = action.payload;
            state.confermaPassword = value;
            state.confermaPasswordError = value !== state.password ? "Le password non corrispondono" : "";
        },
        setRuolo: (state, action) => {
            state.ruolo = action.payload;
        },
        setStripeCustomerId: (state, action) => {
            state.stripeCustomerId = action.payload;
        },
        togglePasswordVisibility: (state) => {
            state.passwordVisible = !state.passwordVisible;
        },
        setResetComponentState: (state) => {
            return {
                ...state,
                nome: "",
                cognome: "",
                email: "",
                password: "",
                confermaPassword: "",
                emailError: "",
                passwordError: "",
                confermaPasswordError: "",
                passwordVisible: false,
            };
        },
    },
});

// Estrai le azioni create
export const {
    setInput,
    setResetComponentState,
    setEmailValidation,
    setPasswordValidation,
    togglePasswordVisibility,
    setConfermaPasswordValidation,
    setStripeCustomerId,
    setRuolo,
} = registrazioneSlice.actions;

// Seleziona parti dello stato
export const selectNome = (state) => state.registrazione.nome;
export const selectCognome = (state) => state.registrazione.cognome;
export const selectEmail = (state) => state.registrazione.email;
export const selectPassword = (state) => state.registrazione.password;
export const selectConfermaPassword = (state) => state.registrazione.confermaPassword;
export const selectEmailError = (state) => state.registrazione.emailError;
export const selectPasswordError = (state) => state.registrazione.passwordError;
export const selectConfermaPasswordError = (state) => state.registrazione.confermaPasswordError;
export const selectPasswordVisible = (state) => state.registrazione.passwordVisible;
export const selectRuolo = (state) => state.registrazione.ruolo;
export const selectStripeCustomerId = (state) => state.registrazione.stripeCustomerId;


// Esporta il reducer
export default registrazioneSlice.reducer;
