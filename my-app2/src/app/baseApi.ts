import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store'

export const baseApi = createApi({
  tagTypes: [
    'RetailInvoice',
    'WholeSaleInvoice',
    'InvoiceArticles',
    'Articles',
    'Storage',
    'StorageConfigurator',
    'LastRetailInvoice',
    'LastWholesaleInvoice',
    'MethodsOfPayment',
    'Storages',
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      let token
      token = (getState() as RootState).auth?.user?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      } else {
        token = null
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
