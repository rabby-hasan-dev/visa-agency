import { baseApi } from './baseApi';

export const accessRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAccessRequest: builder.mutation({
      query: (data) => ({
        url: '/access-requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AccessRequest'],
    }),
    getMyAccessRequests: builder.query({
      query: () => ({
        url: '/access-requests/my-requests',
        method: 'GET',
      }),
      providesTags: ['AccessRequest'],
    }),
    getAllAccessRequests: builder.query({
      query: () => ({
        url: '/access-requests',
        method: 'GET',
      }),
      providesTags: ['AccessRequest'],
    }),
    updateAccessRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/access-requests/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['AccessRequest'],
    }),
    deleteAccessRequest: builder.mutation({
      query: (id) => ({
        url: `/access-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AccessRequest'],
    }),
  }),
});

export const {
  useCreateAccessRequestMutation,
  useGetMyAccessRequestsQuery,
  useGetAllAccessRequestsQuery,
  useUpdateAccessRequestStatusMutation,
  useDeleteAccessRequestMutation,
} = accessRequestApi;
