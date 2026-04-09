import { baseApi } from '../api/baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/register',
                method: 'POST',
                body: userInfo,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: data,
            }),
        }),
        requestEmailChange: builder.mutation({
            query: (data) => ({
                url: '/auth/request-email-change',
                method: 'POST',
                body: data,
            }),
        }),
        verifyEmailChange: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-email-change',
                method: 'POST',
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useChangePasswordMutation,
    useRequestEmailChangeMutation,
    useVerifyEmailChangeMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;
