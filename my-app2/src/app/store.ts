import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { baseApi } from './baseApi'
import authReducer from '../features/authSlice'
import retailReducer from '../features/retailSlice'
import storageReducer from '../features/storageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    retail: retailReducer,
    storage: storageReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.DEV as any,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
