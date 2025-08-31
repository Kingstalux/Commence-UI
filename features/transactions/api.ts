import { baseApi } from "@/lib/api-base";
import type { CheckoutRequest, Transaction } from "./types";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<Transaction, CheckoutRequest>({
      query: (request) => ({
        url: "checkout/process",
        method: "POST",
        body: request,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      invalidatesTags: ["Cart", "Transaction"],
    }),
    getTransactions: builder.query<Transaction[], void>({
      query: () => ({
        url: "orders",
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      transformResponse: (response: any[]) => {
        // Transform backend format to frontend format
        return response.map((transaction) => ({
          ...transaction,
          id: transaction._id || transaction.id,
          createdAt: transaction.createdAt || new Date().toISOString(),
          updatedAt: transaction.updatedAt || new Date().toISOString(),
        }));
      },
      providesTags: ["Transaction"],
    }),
    getTransaction: builder.query<Transaction, string>({
      query: (id) => ({
        url: `orders/${id}`,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),
    cancelOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "POST",
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),
    getOrderReceipt: builder.query<any, string>({
      query: (id) => ({
        url: `orders/${id}/receipt`,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),
    refundOrder: builder.mutation<
      void,
      { id: string; reason?: string; amount?: number }
    >({
      query: ({ id, ...data }) => ({
        url: `orders/${id}/refund`,
        method: "POST",
        body: data,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Transaction", id }],
    }),
    validateCheckout: builder.mutation<
      { valid: boolean; errors?: string[] },
      CheckoutRequest
    >({
      query: (request) => ({
        url: "checkout/validate",
        method: "POST",
        body: request,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCancelOrderMutation,
  useGetOrderReceiptQuery,
  useRefundOrderMutation,
  useValidateCheckoutMutation,
} = transactionsApi;
