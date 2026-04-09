import { baseApi } from './baseApi';

export const visaTypeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET All Visa Types ───────────────────────────────────────────────
        // Used by VisaCategorySelector to show dynamic list
        getVisaTypes: builder.query({
            query: (params?: Record<string, unknown>) => ({
                url: '/visa-types',
                method: 'GET',
                params,
            }),
            providesTags: ['VisaType'],
        }),

        // ── GET Single Visa Type ─────────────────────────────────────────────
        getSingleVisaType: builder.query({
            query: (id: string) => ({
                url: `/visa-types/${id}`,
                method: 'GET',
            }),
            providesTags: ['VisaType'],
        }),

        // ── CREATE Visa Type (superAdmin only) ───────────────────────────────
        createVisaType: builder.mutation({
            query: (data) => ({
                url: '/visa-types',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VisaType'],
        }),

        // ── UPDATE Visa Type (superAdmin only) ───────────────────────────────
        updateVisaType: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/visa-types/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['VisaType'],
        }),

        // ── TOGGLE active status (superAdmin only) ───────────────────────────
        toggleVisaTypeActive: builder.mutation({
            query: (id: string) => ({
                url: `/visa-types/${id}/toggle-active`,
                method: 'PATCH',
            }),
            invalidatesTags: ['VisaType'],
        }),

        // ── DELETE Visa Type (superAdmin only) ───────────────────────────────
        deleteVisaType: builder.mutation({
            query: (id: string) => ({
                url: `/visa-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['VisaType', 'Question'],
        }),
    }),
});

export const {
    useGetVisaTypesQuery,
    useGetSingleVisaTypeQuery,
    useCreateVisaTypeMutation,
    useUpdateVisaTypeMutation,
    useToggleVisaTypeActiveMutation,
    useDeleteVisaTypeMutation,
} = visaTypeApi;
