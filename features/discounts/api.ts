import { baseApi } from "@/lib/api-base"
import type { Discount, ApplyDiscountRequest } from "./types"
import { MOCK_DISCOUNTS } from "@/lib/mock-data"

// Mock discount state
const mockDiscounts = [...MOCK_DISCOUNTS]

// Mock discount logic
const mockDiscountService = {
  getDiscounts: async (): Promise<Discount[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return [...mockDiscounts]
  },

  createDiscount: async (discountData: Omit<Discount, "id" | "currentUses">): Promise<Discount> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newDiscount: Discount = {
      ...discountData,
      id: `discount-${Date.now()}`,
      currentUses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockDiscounts.push(newDiscount)
    return newDiscount
  },

  updateDiscount: async ({ id, updates }: { id: string; updates: Partial<Discount> }): Promise<Discount> => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const discountIndex = mockDiscounts.findIndex((d) => d.id === id)
    if (discountIndex === -1) {
      throw new Error("Discount not found")
    }

    const updatedDiscount = {
      ...mockDiscounts[discountIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    mockDiscounts[discountIndex] = updatedDiscount
    return updatedDiscount
  },

  deleteDiscount: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const discountIndex = mockDiscounts.findIndex((d) => d.id === id)
    if (discountIndex === -1) {
      throw new Error("Discount not found")
    }

    mockDiscounts.splice(discountIndex, 1)
  },

  applyDiscount: async ({
    code,
    orderAmount,
  }: ApplyDiscountRequest): Promise<{ success: boolean; discountAmount: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const discount = mockDiscounts.find((d) => d.code === code && d.isActive)

    if (!discount) {
      throw new Error("Invalid or expired discount code")
    }

    // Check expiration
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      throw new Error("Discount code has expired")
    }

    // Check minimum order amount
    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      throw new Error(`Minimum order amount of $${discount.minOrderAmount} required`)
    }

    // Check usage limit
    if (discount.maxUses && discount.currentUses >= discount.maxUses) {
      throw new Error("Discount code usage limit reached")
    }

    // Calculate discount amount
    let discountAmount = 0
    if (discount.type === "percentage") {
      discountAmount = (orderAmount * discount.value) / 100
      if (discount.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscountAmount)
      }
    } else {
      discountAmount = discount.value
    }

    // Update usage count
    const discountIndex = mockDiscounts.findIndex((d) => d.id === discount.id)
    if (discountIndex >= 0) {
      mockDiscounts[discountIndex].currentUses = (mockDiscounts[discountIndex].currentUses || 0) + 1
    }

    return {
      success: true,
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    }
  },
}

export const discountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<Discount[], void>({
      queryFn: async () => {
        try {
          const data = await mockDiscountService.getDiscounts()
          return { data }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: error instanceof Error ? error.message : "Failed to fetch discounts" },
            },
          }
        }
      },
      providesTags: ["Discount"],
    }),
    createDiscount: builder.mutation<Discount, Omit<Discount, "id" | "currentUses">>({
      queryFn: async (discount) => {
        try {
          const data = await mockDiscountService.createDiscount(discount)
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to create discount" },
            },
          }
        }
      },
      invalidatesTags: ["Discount"],
    }),
    updateDiscount: builder.mutation<Discount, { id: string; updates: Partial<Discount> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const data = await mockDiscountService.updateDiscount({ id, updates })
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to update discount" },
            },
          }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Discount", id }],
    }),
    deleteDiscount: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await mockDiscountService.deleteDiscount(id)
          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to delete discount" },
            },
          }
        }
      },
      invalidatesTags: ["Discount"],
    }),
    applyDiscount: builder.mutation<{ success: boolean; discountAmount: number }, ApplyDiscountRequest>({
      queryFn: async (request) => {
        try {
          const data = await mockDiscountService.applyDiscount(request)
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to apply discount" },
            },
          }
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useApplyDiscountMutation,
} = discountsApi
