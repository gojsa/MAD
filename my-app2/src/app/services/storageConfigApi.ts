import { baseApi } from '../baseApi'

export const storageConfiguratorAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorageConfigurator: builder.query<
      { storage_movement_types: string }[],
      string
    >({
      query: (column) => `/api/storageconfigurator/${column}`,
      providesTags: ['StorageConfigurator'],
    }),
  }),
})

export const { useGetStorageConfiguratorQuery } = storageConfiguratorAPI
