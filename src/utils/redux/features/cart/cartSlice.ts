'use  client'
import { IItemCart } from "@/utils/schemas/Cart";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IItemCart[] = []

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartStore: (state, action) => {
      state = action.payload
    },
    addCartStore: (state, action) => {
      const payload = action.payload
      const indexProduct = state.findIndex(itemCart => (itemCart._product._id === payload._product._id))
      if (indexProduct !== -1) {
        state[indexProduct].quantity = payload.quantity;
      } else {
        state.push(payload);
      }
      for (let i = state.length - 1; i >= 0; i--) {
        if (state[i].quantity === 0) {
            state.splice(i, 1);
        }
    }
      return state
    }
  }
})

export const { setCartStore, addCartStore } = CartSlice.actions
export default CartSlice.reducer