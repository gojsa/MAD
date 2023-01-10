import { createSlice } from '@reduxjs/toolkit'

const companyName = localStorage.getItem('company')
const companyId = localStorage.getItem('companyId')

const initialState = {
  companyName: companyName ? companyName : null,
  companyId: companyId ? companyId : null,
}

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    getCompany: (state, action) => {
      state.companyName = action.payload
    },
    getCompanyId: (state, action) => {
      state.companyId = action.payload
    },
  },
})

export const { getCompany, getCompanyId } = companySlice.actions
export default companySlice.reducer
