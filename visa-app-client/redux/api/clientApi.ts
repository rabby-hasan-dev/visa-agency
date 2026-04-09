import { baseApi } from '../api/baseApi';

export const clientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getClients: builder.query({
            query: (params) => ({
                url: '/clients',
                method: 'GET',
                params,
            }),
            providesTags: ['Client'],
        }),
        createClient: builder.mutation({
            query: (data) => ({
                url: '/clients',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Client'],
        }),
    }),
});

export const { useGetClientsQuery, useCreateClientMutation } = clientApi;
