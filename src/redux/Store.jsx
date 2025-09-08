import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
import cartReducer from "./CartSlice";

export const Store = configureStore({
  reducer: {
    // auth: authReducer,
    cart: cartReducer,
  },
});
