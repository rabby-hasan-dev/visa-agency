import { baseApi } from '../api/baseApi';

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getApplicationMessages: builder.query({
            query: (applicationId: string) => ({
                url: `/messages/${applicationId}`,
                method: 'GET',
            }),
            providesTags: ['Message'],
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                url: '/messages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Message'],
        }),
        markMessagesAsRead: builder.mutation({
            query: (applicationId: string) => ({
                url: `/messages/${applicationId}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Message'],
        }),
    }),
});

export const {
    useGetApplicationMessagesQuery,
    useAddMessageMutation,
    useMarkMessagesAsReadMutation,
} = messageApi;
