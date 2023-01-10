import { baseApi } from '../baseApi'
import { DBArticleModel, ArticleModel } from '../../models/ArticleModel'

export const articleAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticles: builder.query<DBArticleModel[], void>({
      query: () => '/api/articles',
      providesTags: ['Articles'],
    }),
    getOneArticle: builder.query<DBArticleModel, string | number>({
      query: (id) => `/api/articles/${id}`,
      providesTags: (result, err, arg) => [
        { type: 'Articles', id: result?.article_id },
      ],
    }),
    postArticle: builder.mutation<ArticleModel, ArticleModel>({
      query: (article) => ({
        url: '/api/articles',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Articles'],
    }),
    updateArticle: builder.mutation<ArticleModel, Partial<ArticleModel>>({
      query: (article) => ({
        url: '/api/articles/updatearticle',
        mehton: 'PUT',
        body: article,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: 'Articles', id: arg.code },
      ],
    }),
  }),
})

export const {
  useGetAllArticlesQuery,
  useGetOneArticleQuery,
  usePostArticleMutation,
  useUpdateArticleMutation,
} = articleAPI
