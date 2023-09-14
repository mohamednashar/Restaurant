import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import CartSlice from "./CartSlice";

const store = configureStore({
  reducer: {
    cart: CartSlice,
  },
});

export default store;