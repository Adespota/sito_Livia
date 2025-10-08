import { createSlice } from '@reduxjs/toolkit';

// Questo redux serve a memorizzare i dati dell'utente che viene cliccato nel button "Sollecito" di storico pagamenti
const sendReminderSlice = createSlice({
    name: 'sendReminder',
    initialState: {
        selectedContact: null,
    },
    reducers: {
        setSelectedContact: (state, action) => {
            state.selectedContact = action.payload;
        },
    }
});

export const {
    setSelectedContact
} = sendReminderSlice.actions;

export const selectSelectedContact = (state) => state.sendReminder.selectedContact;

export default sendReminderSlice.reducer;
