import { baseApi } from './baseApi';

export const applicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getApplications: builder.query({
            query: (params) => ({
                url: '/visa-applications',
                method: 'GET',
                params,
            }),
            providesTags: ['Application'],
        }),
        getSingleApplication: builder.query({
            query: (id: string) => ({
                url: `/visa-applications/${id}`,
                method: 'GET',
            }),
            providesTags: ['Application'],
        }),
        createApplication: builder.mutation({
            query: (data) => ({
                url: '/visa-applications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
        updateApplicationStep: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/visa-applications/${id}/update-step`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
        submitApplication: builder.mutation({
            query: (id) => ({
                url: `/visa-applications/${id}/submit`,
                method: 'POST',
            }),
            invalidatesTags: ['Application'],
        }),
        updateApplicationStatus: builder.mutation({
            query: ({ id, status, remarks }) => ({
                url: `/visa-applications/${id}/status`,
                method: 'PATCH',
                body: { status, remarks },
            }),
            invalidatesTags: ['Application'],
        }),
        submitUpdateRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/visa-applications/${id}/update-requests`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
        addDocuments: builder.mutation({
            query: ({ id, documents }) => ({
                url: `/visa-applications/${id}/documents`,
                method: 'PATCH',
                body: { documents },
            }),
            invalidatesTags: ['Application'],
        }),
        removeDocument: builder.mutation({
            query: ({ id, documentUrl }) => ({
                url: `/visa-applications/${id}/documents`,
                method: 'DELETE',
                body: { documentUrl },
            }),
            invalidatesTags: ['Application'],
        }),
        deleteApplication: builder.mutation({
            query: (id: string) => ({
                url: `/visa-applications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Application'],
        }),
        addAdminRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/visa-applications/${id}/admin-requests`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
        resolveAdminRequest: builder.mutation({
            query: ({ id, requestId }) => ({
                url: `/visa-applications/${id}/admin-requests/${requestId}/resolve`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Application'],
        }),
        updateTRN: builder.mutation({
            query: ({ id, trn }) => ({
                url: `/visa-applications/${id}/update-step`, // Reuse update-step or status for general updates
                method: 'PATCH',
                body: { trn },
            }),
            invalidatesTags: ['Application'],
        }),
        importApplications: builder.mutation({
            query: (data) => ({
                url: '/visa-applications/import',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
    }),
});

export const {
    useGetApplicationsQuery,
    useGetSingleApplicationQuery,
    useCreateApplicationMutation,
    useUpdateApplicationStepMutation,
    useSubmitApplicationMutation,
    useUpdateApplicationStatusMutation,
    useSubmitUpdateRequestMutation,
    useAddDocumentsMutation,
    useRemoveDocumentMutation,
    useDeleteApplicationMutation,
    useAddAdminRequestMutation,
    useResolveAdminRequestMutation,
    useUpdateTRNMutation,
    useImportApplicationsMutation,
} = applicationApi;
