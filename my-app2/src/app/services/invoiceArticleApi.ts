import { baseApi } from '../baseApi'
import {
  InvoiceArticleModel,
  DBInvoiceArticleModel,
  CancelInvoiceBody,
} from '../../models/InvoiceArticleModel'

type PostInvoiceArticle = {
  article: Partial<InvoiceArticleModel>
  invoiceId: string | number
}

export const invoiceArticleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postInvoiceArticle: builder.mutation({
      query: ({ article, invoiceId }: PostInvoiceArticle) => ({
        url: `/api/invoice-article/create-invoice-article/${invoiceId}`,
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['InvoiceArticles', 'RetailInvoice', 'WholeSaleInvoice'],
    }),
    getInvoiceArticles: builder.query<
      DBInvoiceArticleModel[],
      number | string | undefined
    >({
      query: (invoiceId) =>
        `/api/invoice-article/get-all-invoice-articles/${invoiceId}`,
      providesTags: ['InvoiceArticles'],
    }),
    getInvoiceArticle: builder.query<DBInvoiceArticleModel, number | string>({
      query: (invoiceArticleId) =>
        `/api/invoice-article/get-invoice-article/${invoiceArticleId}`,
      providesTags: (result, error, arg) => [
        { type: 'InvoiceArticles', id: result?.article_id },
      ],
    }),
    updateInvoiceArticle: builder.mutation<
      { message: string; invoice_article_id: number },
      Partial<DBInvoiceArticleModel>
    >({
      query: (article) => ({
        url: '/api/invoice-article/update-invoice-article',
        method: 'PUT',
        body: article,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          console.log(args)
          await queryFulfilled
          dispatch(
            invoiceArticleApi.util.updateQueryData(
              'getInvoiceArticle',
              args.article_id!,
              (draft) => {
                console.log('Okinulo')
                console.log(JSON.stringify(draft))
                console.log(JSON.stringify(Object.assign(draft, args)))
                Object.assign(draft, args)
              }
            )
          )
        } catch (error) {
          // patchResult.undo()
        }
      },
      // invalidatesTags: (result, error, arg) => [
      //   'InvoiceArticles',
      //   'RetailInvoice',
      //   { type: 'InvoiceArticles', id: result?.invoice_article_id },
      // ],
    }),
    deleteInvoiceArticle: builder.mutation<
      { message: string; invoice_article_id: number },
      string | number
    >({
      query: (article_id) => ({
        url: `/api/invoice-article/delete-invoice-article/${article_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        'InvoiceArticles',
        'RetailInvoice',
        { type: 'InvoiceArticles', id: result?.invoice_article_id },
      ],
    }),
    deleteAllInvoiceArticles: builder.mutation<void, string | number>({
      query: (invoice_id) => ({
        url: `/api/invoice-article/delete-invoice-articles/${invoice_id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          invoiceArticleApi.util.updateQueryData(
            'getInvoiceArticles',
            id,
            (draft) => (draft = [])
          )
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
          //dispatch(api.util.invalidateTags(['Post']))
        }
      },
      // invalidatesTags: ['InvoiceArticles', 'RetailInvoice'],
    }),
    cancelInvoiceArticle: builder.mutation<
      DBInvoiceArticleModel,
      {
        invoice_article_id: number
        storage_id: number
        storage_movement_id: number
        selling_price: string
        article_id: number
        saldo: number
      }[]
    >({
      query: (arr) => ({
        url: '/api/invoice-article/cancellationinvoice',
        method: 'PUT',
        body: { arr: arr },
      }),
      invalidatesTags: ['InvoiceArticles', 'RetailInvoice'],
    }),
  }),
})

export const {
  useUpdateInvoiceArticleMutation,
  usePostInvoiceArticleMutation,
  useGetInvoiceArticlesQuery,
  useGetInvoiceArticleQuery,
  useCancelInvoiceArticleMutation,
  useDeleteInvoiceArticleMutation,
  useDeleteAllInvoiceArticlesMutation,
} = invoiceArticleApi
