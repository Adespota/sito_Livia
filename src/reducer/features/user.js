import { createSlice } from "@reduxjs/toolkit";


// Redux utile per prendere i dati dell'utente loggato


const initialState = {
    uid: null,
    email: null,
    displayName: null,
    firstName: null,
    lastName: null,
    isLoading: true,
    error: null,
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { uid, email, displayName, firstName, lastName } = action.payload;
            state.uid = uid;
            state.email = email;
            state.displayName = displayName;
            state.firstName = firstName || null;
            state.lastName = lastName || null;
            state.isLoading = false;
            state.error = null;
        },
        // Resetta lo stato dell'utente al logout
        clearUser: (state) => {
            // Usa Object.assign per un reset completo all'initialState, mantenendo isLoading falso dopo il logout
            Object.assign(state, { ...initialState, isLoading: false });
        },
        // Imposta lo stato di caricamento
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        // Imposta lo stato di errore
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false; // Se c'è un errore, non sta più caricando
        },
    },
});

// Estrai le azioni create (solo quelle definite nei reducers)
export const {
    setUser,
    clearUser,
    setLoading,
    setError,
} = userSlice.actions;

// Selettori per accedere facilmente alle parti dello stato utente
export const selectCurrentUser = (state) => state.user;
export const selectUserUid = (state) => state.user.uid;
export const selectUserEmail = (state) => state.user.email;
export const selectUserDisplayName = (state) => state.user.displayName;
export const selectUserFirstName = (state) => state.user.firstName;
export const selectUserLastName = (state) => state.user.lastName;
export const selectIsUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

// Esporta il reducer
export default userSlice.reducer;
