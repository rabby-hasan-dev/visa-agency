import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Auth', 'Client', 'Application', 'User', 'Message', 'VisaType', 'Question', 'AccessRequest', 'TransitCountry', 'Settings', 'Payments', 'Invoices', 'Fees'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});
