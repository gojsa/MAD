import { createSlice } from '@reduxjs/toolkit'
import { UserType } from '../models/UserModel'

//Get user from local storage
const user = JSON.parse(localStorage.getItem('user') as any)

const initialState = {
  user: user ? (user as UserType) : null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      localStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
