import { configureStore } from "@reduxjs/toolkit";
import weekList from "./slices/weekListSlice";

const store = configureStore({
    reducer: { weekList },
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;