import { baseApi } from '../baseApi'

export const storageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getByOrg: builder.query({
      query: (orgId) => `/api/storage/getbyorg/${orgId}`,
      providesTags: ['Storages']
    }),
  }),
})

export const {useGetByOrgQuery
} = storageApi
