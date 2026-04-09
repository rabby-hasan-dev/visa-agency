import { baseApi } from './baseApi';

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        initiatePayment: builder.mutation({
            query: (data) => ({
                url: '/payments/initiate',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Payments'],
        }),
        getPayments: builder.query({
            query: (params) => ({
                url: '/payments',
                method: 'GET',
                params,
            }),
            providesTags: ['Payments'],
        }),
        getPaymentStats: builder.query({
            query: () => ({
                url: '/payments/stats',
                method: 'GET',
            }),
            providesTags: ['Payments'],
        }),
        getPaymentByTransaction: builder.query({
            query: (tx: string) => ({
                url: `/payments/by-transaction/${tx}`,
                method: 'GET',
            }),
            providesTags: ['Payments'],
        }),
        getAccountingReport: builder.query({
            query: (params) => ({
                url: '/payments/accounting-report',
                method: 'GET',
                params,
            }),
            providesTags: ['Payments'],
        }),
    }),
});

export const { 
    useInitiatePaymentMutation, 
    useGetPaymentsQuery,
    useGetPaymentStatsQuery,
    useGetPaymentByTransactionQuery,
    useGetAccountingReportQuery,
} = paymentApi;
