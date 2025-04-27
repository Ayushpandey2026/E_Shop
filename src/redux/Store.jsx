import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import reducer from "./CartSlice";

export const Store=configureStore({
    reducer:{
        cart:cartReducer
        
    }
});
