import {createSlice} from "@reduxjs/toolkit";

const initialSnackbarState = {
    open: false,
    message: "",
    type: "success", // success, error, warning, info
};

const snackbarSlice = createSlice({
    name: "snackbar",
    initialState: initialSnackbarState,
    reducers: {
        showSnackbar: (state, action) => {
            const { message, type } = action.payload;
            state.open = true;
            state.message = message;
            state.type = type;
        },
        hideSnackbar: (state) => {
            state.open = false;
            state.message = "";
            state.type = "";
        },
    },
});

// Estrai le azioni e il reducer
export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
