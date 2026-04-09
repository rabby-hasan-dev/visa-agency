import { baseApi } from './baseApi';
export const documentApi = baseApi.injectEndpoints({ endpoints: (builder) => ({ uploadDocument: builder.mutation({ query: (file: FormData) => ({ url: '/documents/upload', method: 'POST', body: file, }), }), }), }); export const { useUploadDocumentMutation } = documentApi;
