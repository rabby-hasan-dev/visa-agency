import { baseApi } from "./baseApi";

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeeSettings: builder.query({
      query: () => ({
        url: "/fee/settings",
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    updateFeeSetting: builder.mutation({
      query: (data) => ({
        url: "/fee/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Fees"],
    }),
    addFeeSetting: builder.mutation({
      query: (data) => ({
        url: "/fee/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fees"],
    }),
    deleteFeeSetting: builder.mutation({
      query: (key) => ({
        url: `/fee/settings/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fees"],
    }),
    calculateApplicationFee: builder.query({
      query: (id) => ({
        url: `/fee/calculate/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetFeeSettingsQuery,
  useUpdateFeeSettingMutation,
  useAddFeeSettingMutation,
  useDeleteFeeSettingMutation,
  useCalculateApplicationFeeQuery,
} = feeApi;
