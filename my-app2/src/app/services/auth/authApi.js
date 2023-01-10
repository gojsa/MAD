import { baseApi } from '../../baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        return {
          url: 'api/users/login',
          method: 'POST',
          body: credentials,
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi
