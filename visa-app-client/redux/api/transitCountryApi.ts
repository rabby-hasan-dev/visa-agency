import { baseApi } from './baseApi';

export const transitCountryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET All (admin list) ──────────────────────────────────────────────
        getTransitCountries: builder.query({
            query: (params?: Record<string, unknown>) => ({
                url: '/transit-countries',
                method: 'GET',
                params,
            }),
            providesTags: ['TransitCountry'],
        }),

        // ── GET Active Only (for visa application form) ───────────────────────
        getActiveTransitCountries: builder.query({
            query: () => ({
                url: '/transit-countries/active',
                method: 'GET',
            }),
            providesTags: ['TransitCountry'],
        }),

        // ── GET Single ────────────────────────────────────────────────────────
        getSingleTransitCountry: builder.query({
            query: (id: string) => ({
                url: `/transit-countries/${id}`,
                method: 'GET',
            }),
            providesTags: ['TransitCountry'],
        }),

        // ── CREATE ────────────────────────────────────────────────────────────
        createTransitCountry: builder.mutation({
            query: (data) => ({
                url: '/transit-countries',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['TransitCountry'],
        }),

        // ── UPDATE ────────────────────────────────────────────────────────────
        updateTransitCountry: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transit-countries/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['TransitCountry'],
        }),

        // ── TOGGLE single active status ───────────────────────────────────────
        toggleTransitCountryActive: builder.mutation({
            query: (id: string) => ({
                url: `/transit-countries/${id}/toggle-active`,
                method: 'PATCH',
            }),
            invalidatesTags: ['TransitCountry'],
        }),

        // ── BULK TOGGLE ───────────────────────────────────────────────────────
        bulkToggleTransitCountries: builder.mutation({
            query: ({ ids, isActive }: { ids: string[]; isActive: boolean }) => ({
                url: '/transit-countries/bulk-toggle',
                method: 'PATCH',
                body: { ids, isActive },
            }),
            invalidatesTags: ['TransitCountry'],
        }),

        // ── DELETE ────────────────────────────────────────────────────────────
        deleteTransitCountry: builder.mutation({
            query: (id: string) => ({
                url: `/transit-countries/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TransitCountry'],
        }),
    }),
});

export const {
    useGetTransitCountriesQuery,
    useGetActiveTransitCountriesQuery,
    useGetSingleTransitCountryQuery,
    useCreateTransitCountryMutation,
    useUpdateTransitCountryMutation,
    useToggleTransitCountryActiveMutation,
    useBulkToggleTransitCountriesMutation,
    useDeleteTransitCountryMutation,
} = transitCountryApi;
