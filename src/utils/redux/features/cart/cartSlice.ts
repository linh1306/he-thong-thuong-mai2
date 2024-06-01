'use  client'
import { IItemCart } from "@/utils/schemas/Cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IItemCart[] = []

export const CartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {
    setCartStore: (state, action) => {
      state = action.payload
    },
    updateCart: (state, action) => {
      const payload = action.payload
      const indexProduct = state.findIndex(itemCart => (itemCart._product._id === payload._product._id))

      if (indexProduct !== -1) {
        state[indexProduct].quantity = payload.quantity;
      } else {
        state.push(payload);
      }
      return state
    }
  }
})

export const { setCartStore, updateCart } = CartSlice.actions
export default CartSlice.reducer