import { createSlice } from '@reduxjs/toolkit'
import { DBArticleModel } from '../models/ArticleModel'
import { DBInvoiceArticleModel } from '../models/InvoiceArticleModel'
import { DBRetailInvoice } from '../models/RetailInvoiceModel'

const initialState = {
  selectedArticle: {} as Partial<DBInvoiceArticleModel> &
    Partial<DBArticleModel> & { total: string },
  total: 0,
  paymentMethodTotal: 0,
  VAT: 0,
  currentTotal: '',
  rebateValue: '',
  paymentMethods: [] as {
    method_of_payment_id: number
    total: number
    name: string
  }[],
  selectedInvoice: {} as DBRetailInvoice,
  selectedInvoiceArticles: [] as Partial<DBInvoiceArticleModel>[],
  stornedArticles: [] as Partial<DBInvoiceArticleModel>[],
  autoAdd: true,
  isStorning: false,
  isLoading: false,
  edited: {} as { method_of_payment_id: number; total: number; name: string },
}

const retailSlice = createSlice({
  name: 'retial',
  initialState,
  reducers: {
    reset: () => initialState,
    setVat: (state, action) => {
      state.VAT = action.payload
    },
    setSelectedArticle: (state, action) => {
      state.selectedArticle = action.payload
    },
    setInvoiceTotal: (state, action) => {
      state.total = action.payload
    },
    setRebateValue: (state, action) => {
      state.rebateValue = action.payload
    },
    setCurrentTotal: (state, action) => {
      state.currentTotal = action.payload
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload
    },
    setPaymentMethodTotal: (state, action) => {
      state.paymentMethodTotal = action.payload
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload
    },
    setSelectecedInvoiceArticles: (state, action) => {
      state.selectedInvoiceArticles = action.payload
    },
    setAutoAdd: (state, action) => {
      state.autoAdd = action.payload
    },
    setIsStorning: (state, action) => {
      state.isStorning = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setEdited: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  reset,
  setVat,
  setSelectedArticle,
  setInvoiceTotal,
  setRebateValue,
  setCurrentTotal,
  setPaymentMethods,
  setPaymentMethodTotal,
  setSelectedInvoice,
  setSelectecedInvoiceArticles,
  setAutoAdd,
  setIsStorning,
  setIsLoading,
  setEdited,
} = retailSlice.actions
export default retailSlice.reducer
