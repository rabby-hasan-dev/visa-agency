import { baseApi } from '../api/baseApi';

export const invoiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: (params) => ({
                url: '/invoices',
                method: 'GET',
                params,
            }),
            providesTags: ['Invoices'],
        }),
        getSingleInvoice: builder.query({
            query: (id: string) => ({
                url: `/invoices/${id}`,
                method: 'GET',
            }),
            providesTags: ['Invoices'],
        }),
        createInvoice: builder.mutation({
            query: (data) => ({
                url: '/invoices',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Invoices'],
        }),
        payInvoice: builder.mutation({
            query: ({ id, paymentMethod }) => ({
                url: `/invoices/${id}/pay`,
                method: 'POST',
                body: { paymentMethod },
            }),
            invalidatesTags: ['Invoices'],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetSingleInvoiceQuery,
    useCreateInvoiceMutation,
    usePayInvoiceMutation,
} = invoiceApi;
