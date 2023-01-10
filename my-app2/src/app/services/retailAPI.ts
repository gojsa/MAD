import { baseApi } from '../baseApi'
import { DBInvoiceArticleModel } from '../../models/InvoiceArticleModel'
import {
  DBRetailInvoice,
  RetailInvoiceObject,
} from '../../models/RetailInvoiceModel'

export const retailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRetailInvoices: builder.query<DBRetailInvoice[], void>({
      query: () => '/api/invoice/get-all-invoices/MALOPRODAJA',
      providesTags: ['RetailInvoice'],
    }),
    getRetailInvoice: builder.query<DBRetailInvoice, number | string>({
      query: (invoice_id) => `/api/invoice/get-invoice/${invoice_id}`,
      providesTags: (result, error, arg) => [
        'InvoiceArticles',
        { type: 'RetailInvoice', id: result?.invoice_id },
      ],
    }),
    createRetailInvoice: builder.mutation<
      { message: string; invoice: string | number },
      { userId: string | number; invoiceObj: Partial<RetailInvoiceObject> }
    >({
      query: ({ invoiceObj, userId }) => ({
        url: `/api/invoice/${userId}`,
        method: 'POST',
        body: {
          ...invoiceObj,
          invoice_type: 'MALOPRODAJA',
        },
      }),
      invalidatesTags: [
        'RetailInvoice',
        'LastRetailInvoice',
        'InvoiceArticles',
      ],
    }),
    updateRetailInvoice: builder.mutation<DBRetailInvoice, DBRetailInvoice>({
      query: (invoiceObj) => ({
        url: '/api/invoice',
        method: 'PUT',
        body: { ...invoiceObj, invoice_type: 'MALOPRODAJA' },
      }),
      invalidatesTags: ['RetailInvoice'],
    }),
    deleteRetailInvoice: builder.mutation<void, string | number>({
      query: (invoiceId) => ({
        url: `/api/invoice/delete-invoice/${invoiceId}`,
        method: 'DELETE',
      }),
      //Optimisticly updating retailInvoices
      async onQueryStarted(invoiceId, { dispatch, queryFulfilled }) {
        dispatch(
          retailApi.util.updateQueryData(
            'getRetailInvoices',
            undefined,
            (draft) => {
              console.log(JSON.stringify(draft))
              draft.filter((inv) => inv.invoice_id !== invoiceId)
            }
          )
        )
        try {
          await queryFulfilled
        } catch {
          dispatch(
            retailApi.util.invalidateTags([
              'RetailInvoice',
              'LastRetailInvoice',
            ])
          )
        }
      },
      // invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    getLastInvoice: builder.query<DBRetailInvoice, void>({
      query: () => '/api/invoice/get-last-invoice/MALOPRODAJA',
      providesTags: ['LastRetailInvoice'],
    }),
    printRetailInvoiceOnRegister: builder.mutation<
      void,
      { invoiceId: string | number; total: number | string }
    >({
      query: ({ invoiceId, total }) => ({
        url: `/api/cash-register/generate/${invoiceId}/?total_invoice=${total}`,
        method: 'POST',
        body: { command: 'SFR' },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    printDuplicateInvoiceOnRegister: builder.mutation<
      void,
      { command: string; number: string }
    >({
      query: ({ command, number }) => ({
        url: `/api/cash-register/duplicate`,
        method: 'POST',
        body: { command, number },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    stornoRetailInvoiceOnRegister: builder.mutation<
      { body: string },
      string | number
    >({
      query: (invoiceId) => ({
        url: `/api/cash-register/generate/${invoiceId}`,
        method: 'POST',
        body: { command: 'SRR' },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    printPeriodicInvoiceOnRegister: builder.mutation<
      void,
      { dateFrom: Date; dateTo: Date }
    >({
      query: ({ dateFrom, dateTo }) => ({
        url: '/api/cash-register/period',
        method: 'POST',
        body: { dateFrom, dateTo },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    printPeriodicReportInvoiceOnRegister: builder.mutation<
      void,
      { dateFrom: Date; dateTo: Date }
    >({
      query: ({ dateFrom, dateTo }) => ({
        url: '/api/cash-register/period-report',
        method: 'POST',
        body: { dateFrom, dateTo },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    printEndOfDayInvoiceOnRegister: builder.mutation<void, void>({
      query: () => ({
        url: '/api/cash-register/end',
        method: 'POST',
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
    checkStorageStatus: builder.query<void, string | number>({
      query: (invoiceId) =>
        `/api/cash-register/check-storage-status/${invoiceId}`,
    }),
    cancelInvoice: builder.mutation<
      void,
      {
        srrNumber: string
        articles: Partial<DBInvoiceArticleModel>[]
        cancel_type: string
        invoice_id: string | number
      }
    >({
      query: ({ articles, cancel_type, invoice_id, srrNumber }) => ({
        url: `/api/invoice/cancel-invoice/${invoice_id}/${cancel_type}`,
        method: 'POST',
        body: { invoice_articles: articles, srrNumber },
      }),
      invalidatesTags: ['RetailInvoice', 'LastRetailInvoice'],
    }),
  }),
})

export const {
  useGetRetailInvoicesQuery,
  useGetRetailInvoiceQuery,
  useUpdateRetailInvoiceMutation,
  usePrintRetailInvoiceOnRegisterMutation,
  useCancelInvoiceMutation,
  usePrintPeriodicInvoiceOnRegisterMutation,
  usePrintDuplicateInvoiceOnRegisterMutation,
  usePrintPeriodicReportInvoiceOnRegisterMutation,
  usePrintEndOfDayInvoiceOnRegisterMutation,
  useDeleteRetailInvoiceMutation,
  useCreateRetailInvoiceMutation,
  useGetLastInvoiceQuery,
  useStornoRetailInvoiceOnRegisterMutation,
  useCheckStorageStatusQuery,
} = retailApi
