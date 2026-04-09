import { baseApi } from './baseApi';
export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({ url: '/admin/stats', method: 'GET' }),
            providesTags: ['Application', 'User'],
        }),
        getAgentPerformance: builder.query({
            query: () => ({ url: '/admin/agent-performance', method: 'GET' }),
            providesTags: ['User'],
        }),
        createAgent: builder.mutation({
            query: (data) => ({ url: '/users/create-agent', method: 'POST', body: data }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({ url: `/users/update/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: ['User'],
        }),
        getAgentDetails: builder.query({
            query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
            providesTags: ['User'],
        }),
        getAgentApplications: builder.query({
            query: (id) => ({ url: `/visa-applications?createdByAgentId=${id}`, method: 'GET' }),
            providesTags: ['Application'],
        }),
        getAgents: builder.query({
            query: () => ({ url: '/users/agents', method: 'GET' }),
            providesTags: ['User'],
        }),
        getAdmins: builder.query({
            query: () => ({ url: '/admin/admins', method: 'GET' }),
            providesTags: ['User'],
        }),
        updateAdminStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/admins/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['User'],
        }),
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `/admin/admins/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        getUserPasswords: builder.query({
            query: () => ({ url: '/user-passwords', method: 'GET' }),
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetAgentPerformanceQuery,
    useCreateAgentMutation,
    useUpdateUserMutation,
    useGetAgentDetailsQuery,
    useGetAgentApplicationsQuery,
    useGetAgentsQuery,
    useGetAdminsQuery,
    useUpdateAdminStatusMutation,
    useDeleteAdminMutation,
    useGetUserPasswordsQuery,
} = adminApi;
