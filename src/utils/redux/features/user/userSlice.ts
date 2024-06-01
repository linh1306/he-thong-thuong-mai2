'use  client'
import { IUser } from "@/utils/schemas/User";
import { createSlice } from "@reduxjs/toolkit";

export interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStore: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setUserStore } = userSlice.actions
export default userSlice.reducer