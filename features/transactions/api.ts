import { baseApi } from "@/lib/api-base"
import type { CheckoutRequest, Transaction } from "./types"
import { MOCK_TRANSACTIONS, MOCK_PRODUCTS } from "@/lib/mock-data"

// Mock transactions state
const mockTransactions = [...MOCK_TRANSACTIONS]

// Mock transactions logic
const mockTransactionService = {
  checkout: async (request: CheckoutRequest): Promise<Transaction> => {
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate payment processing

    // Calculate totals
    const items = request.items.map((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      const price = product.discountedPrice || product.price
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = request.discountAmount || 0
    const total = subtotal - discountAmount

    // Create new transaction
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: request.userId || "user1",
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      status: "completed",
      paymentMethod: request.paymentMethod,
      shippingAddress: request.shippingAddress,
      billingAddress: request.billingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockTransactions.unshift(newTransaction) // Add to beginning for newest first
    return newTransaction
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    // Return transactions sorted by newest first
    return [...mockTransactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<Transaction, CheckoutRequest>({
      queryFn: async (request) => {
        try {
          const data = await mockTransactionService.checkout(request)
          return { data }
        } catch (error) {
          return {
            error: { status: 400, data: { message: error instanceof Error ? error.message : "Checkout failed" } },
          }
        }
      },
      invalidatesTags: ["Cart", "Transaction"],
    }),
    getTransactions: builder.query<Transaction[], void>({
      queryFn: async () => {
        try {
          const data = await mockTransactionService.getTransactions()
          return { data }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: error instanceof Error ? error.message : "Failed to fetch transactions" },
            },
          }
        }
      },
      providesTags: ["Transaction"],
    }),
  }),
})

export const { useCheckoutMutation, useGetTransactionsQuery } = transactionsApi
