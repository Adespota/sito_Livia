import { createSlice } from "@reduxjs/toolkit";


const DEFAULT_INITIAL_MESSAGE = [
    {
        text: "Sono pronto, come posso aiutarti?",
        sender: "IA"
    }
];


const chatGeminiSlice = createSlice({
    name: 'chatGemini',
    initialState: {
        listChat: [...DEFAULT_INITIAL_MESSAGE],
    },
    reducers: {
        setListChat(state, action) {
            state.listChat = action.payload;
        },
        addMessage(state, action) {
            state.listChat.push(action.payload);
        },
        clearChat(state) {
            state.listChat = [...DEFAULT_INITIAL_MESSAGE];
        },
    },
});

export const {
    setListChat,
    addMessage,
    clearChat
} = chatGeminiSlice.actions;

export default chatGeminiSlice.reducer;
