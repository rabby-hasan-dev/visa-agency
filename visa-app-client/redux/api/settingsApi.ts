import { baseApi } from './baseApi';

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSiteSettings: builder.query({
            query: () => ({
                url: '/settings/site',
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),
        updateSiteSettings: builder.mutation({
            query: (data) => ({
                url: '/settings/site',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
        getNavigation: builder.query({
            query: (role?: string) => ({
                url: '/settings/navigation',
                method: 'GET',
                params: role ? { role } : {},
            }),
            providesTags: ['Settings'],
        }),
        updateNavigation: builder.mutation({
            query: (data) => ({
                url: '/settings/navigation',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
        getGlobalOptions: builder.query({
            query: () => ({
                url: '/settings/global-options',
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),
        updateGlobalOptions: builder.mutation({
            query: (data) => ({
                url: '/settings/global-options',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
        getPaymentConfig: builder.query({
            query: () => ({
                url: '/settings/payment-config',
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),
        updatePaymentConfig: builder.mutation({
            query: (data) => ({
                url: '/settings/payment-config',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
        getCloudinaryConfig: builder.query({
            query: () => ({
                url: '/settings/cloudinary-config',
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),
        updateCloudinaryConfig: builder.mutation({
            query: (data) => ({
                url: '/settings/cloudinary-config',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
        getAppConfig: builder.query({
            query: () => ({
                url: '/settings/app-config',
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),
        updateAppConfig: builder.mutation({
            query: (data) => ({
                url: '/settings/app-config',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetSiteSettingsQuery,
    useUpdateSiteSettingsMutation,
    useGetNavigationQuery,
    useUpdateNavigationMutation,
    useGetGlobalOptionsQuery,
    useUpdateGlobalOptionsMutation,
    useGetPaymentConfigQuery,
    useUpdatePaymentConfigMutation,
    useGetCloudinaryConfigQuery,
    useUpdateCloudinaryConfigMutation,
    useGetAppConfigQuery,
    useUpdateAppConfigMutation,
} = settingsApi;
