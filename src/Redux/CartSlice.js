"use client";

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],

  reducers: {
    add(state, action) {
      const findProduct=state.find((product)=>product.item.title===action.payload.item.title)
      if(!findProduct){state.push(action.payload);}
      
    },

    remove(state, action) {
      return state.filter((item) => item.item.title != action.payload.title);
    },
     clear:  (state, action) => {
        return [];
     },
  },
});


export const { add, remove,clear } = cartSlice.actions;

export default cartSlice.reducer;
