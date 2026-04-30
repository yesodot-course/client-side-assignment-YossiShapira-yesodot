import { combineReducers } from "@reduxjs/toolkit";

import { cartReducer } from "../../features/cart/store/cart.slice";

export const rootReducer = combineReducers({
  cart: cartReducer,
});