import { baseApi } from "./baseApi";

const enquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnquiry: builder.mutation({
      query: (data) => ({
        url: "/enquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enquiries"],
    }),
    getAllEnquiries: builder.query({
      query: (params) => ({
        url: "/enquiries",
        method: "GET",
        params,
      }),
      providesTags: ["Enquiries"],
    }),
    updateEnquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/enquiries/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Enquiries"],
    }),
    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/enquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enquiries"],
    }),
  }),
});

export const {
  useCreateEnquiryMutation,
  useGetAllEnquiriesQuery,
  useUpdateEnquiryStatusMutation,
  useDeleteEnquiryMutation,
} = enquiryApi;
