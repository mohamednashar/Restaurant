'use client';
import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {}
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { meal, quantity, size, selectedOptions, unitPrice, total } = action.payload;
      const existing = state.items.find(
        (item) => item.meal._id === meal._id && item.size === size
      );
      if (existing) {
        existing.quantity += quantity;
        existing.total = existing.quantity * existing.unitPrice;
      } else {
        state.items.push({ meal, quantity, size, selectedOptions, unitPrice, total });
      }
      saveCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((_, i) => i !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action) {
      const { index, quantity } = action.payload;
      if (state.items[index]) {
        state.items[index].quantity = quantity;
        state.items[index].total = quantity * state.items[index].unitPrice;
      }
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.total, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
