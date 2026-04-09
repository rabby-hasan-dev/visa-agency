import { baseApi } from './baseApi';

export const questionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET All Questions (filterable by visaTypeId + stepNumber) ────────
        // e.g. useGetQuestionsQuery({ visaTypeId: 'xxx' })
        // e.g. useGetQuestionsQuery({ visaTypeId: 'xxx', stepNumber: 3 })
        getQuestions: builder.query({
            query: (params?: Record<string, unknown>) => ({
                url: '/questions',
                method: 'GET',
                params,
            }),
            providesTags: ['Question'],
        }),

        // ── GET Steps Config for a Visa Type ─────────────────────────────────
        // Most important endpoint — returns full step+question config for the
        // application form. Used by DynamicStepRenderer (Step 7).
        //
        // Response shape:
        // {
        //   totalSteps: 10,
        //   sidebarLinks: [...],
        //   steps: {
        //     1: { label: "Terms & Conditions", questions: [...] },
        //     2: { label: "Applicant Details",  questions: [...] },
        //   }
        // }
        getStepsConfig: builder.query({
            query: (visaTypeId: string) => ({
                url: `/questions/steps-config/${visaTypeId}`,
                method: 'GET',
            }),
            providesTags: ['Question', 'VisaType'],
        }),

        // ── GET Single Question ───────────────────────────────────────────────
        getSingleQuestion: builder.query({
            query: (id: string) => ({
                url: `/questions/${id}`,
                method: 'GET',
            }),
            providesTags: ['Question'],
        }),

        // ── CREATE Question (superAdmin only) ────────────────────────────────
        createQuestion: builder.mutation({
            query: (data) => ({
                url: '/questions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Question'],
        }),

        // ── UPDATE Question (superAdmin only) ────────────────────────────────
        updateQuestion: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/questions/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Question'],
        }),

        // ── DELETE Question (superAdmin only) ────────────────────────────────
        deleteQuestion: builder.mutation({
            query: (id: string) => ({
                url: `/questions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Question'],
        }),

        // ── BULK REORDER Questions (superAdmin only) ─────────────────────────
        // body: { items: [{ id: string; sortOrder: number }] }
        reorderQuestions: builder.mutation({
            query: (items: { id: string; sortOrder: number }[]) => ({
                url: '/questions/reorder',
                method: 'PATCH',
                body: { items },
            }),
            invalidatesTags: ['Question'],
        }),
    }),
});

export const {
    useGetQuestionsQuery,
    useGetStepsConfigQuery,
    useGetSingleQuestionQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
    useReorderQuestionsMutation,
} = questionApi;
