import { baseApi } from "@/lib/api-base"
import type { PaymentMethod, CreatePaymentMethodRequest, CheckoutRequest, CheckoutResponse } from "./types"

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit_card",
    cardholderName: "John Doe",
    last4: "4242",
    brand: "Visa",
    expiryDate: "12/25",
    isDefault: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "credit_card",
    cardholderName: "John Doe",
    last4: "5555",
    brand: "Mastercard",
    expiryDate: "08/26",
    isDefault: false,
    createdAt: "2024-02-10T14:30:00Z",
  },
]

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { data: mockPaymentMethods }
      },
      providesTags: ["PaymentMethod"],
    }),

    createPaymentMethod: builder.mutation<PaymentMethod, CreatePaymentMethodRequest>({
      queryFn: async (newPaymentMethod) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        const paymentMethod: PaymentMethod = {
          id: Date.now().toString(),
          ...newPaymentMethod,
          last4: newPaymentMethod.cardNumber?.slice(-4) || "",
          brand: newPaymentMethod.cardNumber?.startsWith("4") ? "Visa" : "Mastercard",
          createdAt: new Date().toISOString(),
        }

        mockPaymentMethods.push(paymentMethod)
        return { data: paymentMethod }
      },
      invalidatesTags: ["PaymentMethod"],
    }),

    deletePaymentMethod: builder.mutation<void, string>({
      queryFn: async (id) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const index = mockPaymentMethods.findIndex((pm) => pm.id === id)
        if (index > -1) {
          mockPaymentMethods.splice(index, 1)
        }

        return { data: undefined }
      },
      invalidatesTags: ["PaymentMethod"],
    }),

    setDefaultPaymentMethod: builder.mutation<void, string>({
      queryFn: async (id) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Set all to non-default first
        mockPaymentMethods.forEach((pm) => (pm.isDefault = false))

        // Set the selected one as default
        const paymentMethod = mockPaymentMethods.find((pm) => pm.id === id)
        if (paymentMethod) {
          paymentMethod.isDefault = true
        }

        return { data: undefined }
      },
      invalidatesTags: ["PaymentMethod"],
    }),

    processCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      queryFn: async (checkoutData) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate successful checkout
        const response: CheckoutResponse = {
          orderId: `ORD-${Date.now()}`,
          status: "success",
          message: "Your order has been placed successfully!",
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        }

        return { data: response }
      },
    }),
  }),
})

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useProcessCheckoutMutation,
} = paymentsApi
