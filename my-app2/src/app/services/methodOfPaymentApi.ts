import { baseApi } from '../baseApi'

export const methodsOfPaymentAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMethodsOfPayment: builder.query<
      { method_of_payment_id: number; name: string }[],
      void
    >({
      query: () => '/api/method-of-payment',
      providesTags: ['MethodsOfPayment'],
    }),
    postMethodOfPaymentOnInvoice: builder.mutation<
      void,
      {
        invoice_id: string | number
        methods_of_payment: {
          method_of_payment_id: number
          total: number
          name?: string
        }[]
      }
    >({
      query: ({ invoice_id, methods_of_payment }) => ({
        url: `/api/method-of-payment/add-methods-of-payment/${invoice_id}`,
        method: 'POST',
        body: { methods_of_payment },
      }),
    }),
  }),
})

export const {
  useGetMethodsOfPaymentQuery,
  usePostMethodOfPaymentOnInvoiceMutation,
} = methodsOfPaymentAPI
