import { baseApi } from "@/lib/api-base";
import type {
  PaymentMethod,
  CreatePaymentMethodRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "./types";

// Utility function to detect card brand from card number
const detectCardBrand = (cardNumber: string): string => {
  if (!cardNumber) return "Unknown";

  // Remove spaces and non-digits
  const cleanNumber = cardNumber.replace(/\D/g, "");

  // Visa: starts with 4
  if (/^4/.test(cleanNumber)) {
    return "Visa";
  }

  // Mastercard: starts with 5 or 2221-2720
  if (
    /^5[1-5]/.test(cleanNumber) ||
    /^2(22[1-9]|2[3-9]|[3-6]|7[01]|720)/.test(cleanNumber)
  ) {
    return "Mastercard";
  }

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(cleanNumber)) {
    return "American Express";
  }

  // Discover: starts with 6011, 622126-622925, 644-649, or 65
  if (
    /^6011|^622(12[6-9]|1[3-9]|[2-8]|9[01]|92[0-5])|^64[4-9]|^65/.test(
      cleanNumber
    )
  ) {
    return "Discover";
  }

  // Diners Club: starts with 300-305, 36, or 38
  if (/^3(0[0-5]|[68])/.test(cleanNumber)) {
    return "Diners Club";
  }

  // JCB: starts with 35
  if (/^35/.test(cleanNumber)) {
    return "JCB";
  }

  return "Unknown";
};

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => ({
        url: "users/payment-methods",
        method: "GET",
      }),
      transformResponse: (response: any[]) => {
        return response.map((paymentMethod) => ({
          ...paymentMethod,
          id: paymentMethod._id || paymentMethod.id,
          brand: paymentMethod.brand || "Unknown",
          expiryDate:
            paymentMethod.expiryMonth && paymentMethod.expiryYear
              ? `${paymentMethod.expiryMonth
                  .toString()
                  .padStart(2, "0")}/${paymentMethod.expiryYear
                  .toString()
                  .slice(-2)}`
              : paymentMethod.expiryDate,
          createdAt: paymentMethod.createdAt || new Date().toISOString(),
        }));
      },
      providesTags: ["PaymentMethod"],
    }),

    createPaymentMethod: builder.mutation<
      PaymentMethod,
      CreatePaymentMethodRequest
    >({
      query: (newPaymentMethod) => {
        // Extract expiry month and year from expiryDate (MM/YY format)
        const [expiryMonth, expiryYear] =
          newPaymentMethod.expiryDate?.split("/") || [];

        const detectedBrand = detectCardBrand(
          newPaymentMethod.cardNumber || ""
        );
        console.log("Card brand detection:", {
          cardNumber: newPaymentMethod.cardNumber,
          detectedBrand,
        });

        return {
          url: "users/payment-methods",
          method: "POST",
          body: {
            type:
              newPaymentMethod.type === "credit_card" ||
              newPaymentMethod.type === "debit_card"
                ? "card"
                : newPaymentMethod.type,
            cardholderName: newPaymentMethod.cardholderName,
            last4: newPaymentMethod.cardNumber?.slice(-4) || "",
            brand: detectedBrand,
            expiryMonth: expiryMonth ? parseInt(expiryMonth) : undefined,
            expiryYear: expiryYear ? parseInt(`20${expiryYear}`) : undefined,
            isDefault: newPaymentMethod.isDefault,
            token: `tok_${Date.now()}`, // In real app, this would come from payment processor
          },
        };
      },
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        type: response.type === "card" ? "credit_card" : response.type,
        brand: response.brand || "Unknown",
        expiryDate:
          response.expiryMonth && response.expiryYear
            ? `${response.expiryMonth
                .toString()
                .padStart(2, "0")}/${response.expiryYear.toString().slice(-2)}`
            : undefined,
        createdAt: response.createdAt || new Date().toISOString(),
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    deletePaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    setDefaultPaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/payment-methods/${id}/default`,
        method: "PUT",
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    processCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (checkoutData) => ({
        url: "orders/checkout",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Cart"], // This will refresh the cart after checkout
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useProcessCheckoutMutation,
} = paymentsApi;
