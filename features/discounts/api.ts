import { baseApi } from "@/lib/api-base";
import type { Discount, ApplyDiscountRequest } from "./types";

export const discountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<Discount[], void>({
      query: () => "admin/discounts",
      transformResponse: (response: any[]) => {
        // Transform backend format to frontend format
        return response.map((discount) => ({
          ...discount,
          id: discount._id || discount.id,
          createdAt: discount.createdAt || new Date().toISOString(),
          updatedAt: discount.updatedAt || new Date().toISOString(),
        }));
      },
      providesTags: ["Discount"],
    }),
    createDiscount: builder.mutation<
      Discount,
      Omit<Discount, "id" | "currentUses">
    >({
      query: (discount) => ({
        url: "admin/discounts",
        method: "POST",
        body: discount,
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      invalidatesTags: ["Discount"],
    }),
    updateDiscount: builder.mutation<
      Discount,
      { id: string; updates: Partial<Discount> }
    >({
      query: ({ id, updates }) => ({
        url: `admin/discounts/${id}`,
        method: "PUT",
        body: updates,
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Discount", id }],
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/discounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discount"],
    }),
    applyDiscount: builder.mutation<
      { success: boolean; discountAmount: number },
      ApplyDiscountRequest
    >({
      query: (request) => ({
        url: "cart/apply-discount",
        method: "POST",
        body: request,
        headers: {
          // Add authorization header for authenticated requests
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
    validateDiscount: builder.query<
      { valid: boolean; discount?: Discount },
      { code: string; orderAmount: number }
    >({
      query: ({ code, orderAmount }) => ({
        url: `discounts/validate`,
        params: { code, orderAmount },
      }),
      transformResponse: (response: any) => ({
        ...response,
        discount: response.discount
          ? {
              ...response.discount,
              id: response.discount._id || response.discount.id,
            }
          : undefined,
      }),
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useApplyDiscountMutation,
  useValidateDiscountQuery,
} = discountsApi;
