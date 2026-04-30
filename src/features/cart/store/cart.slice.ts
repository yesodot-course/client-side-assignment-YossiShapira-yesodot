import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, CartState } from "../types";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock);
        return;
      }
      state.items.push(action.payload);
    },
    increaseItemQuantity(state, action: PayloadAction<string>) {
      const existing = state.items.find((item) => item.id === action.payload);
      if (!existing) {
        return;
      }
      existing.quantity = Math.min(existing.quantity + 1, existing.stock);
    },
    decreaseItemQuantity(state, action: PayloadAction<string>) {
      const existing = state.items.find((item) => item.id === action.payload);
      if (!existing) {
        return;
      }
      if (existing.quantity <= 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        return;
      }
      existing.quantity -= 1;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, increaseItemQuantity, decreaseItemQuantity, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;