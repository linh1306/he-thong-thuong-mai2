'use  client'
import { IUser } from "@/utils/schemas/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const initialState: IUser = {}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStore: (state, action) => {
      return action.payload
    }
  }
})

export const { setUserStore } = userSlice.actions
export default userSlice.reducer