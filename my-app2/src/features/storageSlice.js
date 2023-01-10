import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseURL = process.env.REACT_APP_URL

// const localStorageOrgUnit = JSON.parse(localStorage.getItem('user'))

const final = 1
// const {  organizational_units_id} = useSelector((state) => state.auth.user.placeOfExpense[0].organizational_unit)

export const get = createAsyncThunk('storages/getStorage', async (orgUniId) => {
  const res = await axios.get(baseURL + `/api/storage/getbyorg/${orgUniId}`)
  return res.data
})

export const add = createAsyncThunk('storages/addStorage', async (storage) => {
  const res = await axios.post(baseURL + '/api/storage', storage)
  return res.data
})

export const update = createAsyncThunk('storages/update', async (updObj) => {
  const res = await axios.put(baseURL + '/api/storage', {
    storage_id: updObj.storage_id,
    storage_number: updObj.storage_number,
    name: updObj.name,
    description: updObj.description,
    responsible: updObj.responsible,
    email: updObj.email,
    satus: updObj.satus,
    org_unit: updObj.org_unit,
    org_name: updObj.org_name,
    cost_center: updObj.cost_center,
    cost_center_name: updObj.cost_center_name,
  })
  return res.data
})

export const remove = createAsyncThunk('storages/delete', async (updObj) => {
  const res = await axios.put(baseURL + '/api/storage', {
    storage_id: updObj.storage_id,
    valid: updObj.valid,
  })
  return res.data
})

export const storageSlice = createSlice({
  name: 'storage',
  initialState: {
    storages: [],
    isSuccess: false,
  },
  reducers: {
    reset: (state) => {
      state.isSuccess = false
    },
  },
  extraReducers: {
    [get.fulfilled]: (state, action) => {
      state.storages = action.payload
    },
    [add.fulfilled]: (state, action) => {
      state.isSuccess = true
      state.storages.push(action.payload)
    },
    [update.fulfilled]: (state, action) => {
      state.isSuccess = true
      const index = state.storages.findIndex(
        (storage) => storage.storage_id === action.payload.id
      )
      state[index] = {
        ...state[index],
        ...action.payload,
      }
    },
    [remove.fulfilled]: (state, action) => {
      state.isSuccess = true
      const index = state.storages.findIndex(
        (storage) => storage.storage_id === action.payload.id
      )
      state[index] = {
        ...state[index],
        ...action.payload,
      }
    },
  },
})

export const { reset } = storageSlice.actions
export default storageSlice.reducer
