import { createSlice } from '@reduxjs/toolkit';

export const carrelloSlice = createSlice({
    name: 'carrello',
    initialState: {
        item: '',
        price: 0,
        plan: false, // true vuol dire fatturazione annuale e false vuol dire fatturazione mensile
        planId: '',
    },
    reducers: {
        addToCart: (state, action) => {
            state.item = action.payload.item;
            state.price = action.payload.price;
            state.planId = action.payload.planId;

        },
        setPlan: (state, action) => {
            state.plan = action.payload;
        },
        cleanPlan: (state) => {
            state.item = '';
            state.price = 0;
            state.plan = false;
            state.planId = '';
        },
    },
});

export const {
    addToCart,
    setPlan,
    cleanPlan,
} = carrelloSlice.actions;

export const selectCarrello = (state) => state.carrello;

export default carrelloSlice.reducer;
