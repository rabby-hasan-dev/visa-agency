import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => ({
                url: '/users/get-me',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: '/users/update-my-profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetMeQuery, useUpdateMyProfileMutation } = userApi;
