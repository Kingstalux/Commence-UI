import { baseApi } from "@/lib/api-base"
import type { Cart, CartItem } from "./types"
import { MOCK_CART_ITEMS, MOCK_PRODUCTS } from "@/lib/mock-data"

// Mock cart state
const mockCartItems = [...MOCK_CART_ITEMS]

// Mock cart logic
const mockCart = {
  getCart: async (): Promise<Cart> => {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const items = mockCartItems
      .map((item) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
        return {
          ...item,
          product: product!,
        }
      })
      .filter((item) => item.product) // Filter out items with missing products

    const subtotal = items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    return {
      id: "cart-1",
      userId: "user1",
      items,
      subtotal,
      createdAt: "2024-01-25T08:00:00Z",
      updatedAt: new Date().toISOString(),
    }
  },

  addToCart: async ({ productId, quantity }: { productId: string; quantity: number }): Promise<CartItem> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      throw new Error("Product not found")
    }

    // Check if item already exists in cart
    const existingItemIndex = mockCartItems.findIndex((item) => item.productId === productId)

    if (existingItemIndex >= 0) {
      // Update existing item
      mockCartItems[existingItemIndex].quantity += quantity
      return {
        ...mockCartItems[existingItemIndex],
        product,
      }
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId,
        quantity,
        addedAt: new Date().toISOString(),
        product,
      }
      mockCartItems.push(newItem)
      return newItem
    }
  },

  updateCartItem: async ({ id, quantity }: { id: string; quantity: number }): Promise<CartItem> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const itemIndex = mockCartItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      throw new Error("Cart item not found")
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      mockCartItems.splice(itemIndex, 1)
      throw new Error("Item removed from cart")
    }

    mockCartItems[itemIndex].quantity = quantity
    const product = MOCK_PRODUCTS.find((p) => p.id === mockCartItems[itemIndex].productId)

    return {
      ...mockCartItems[itemIndex],
      product: product!,
    }
  },

  removeFromCart: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const itemIndex = mockCartItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      throw new Error("Cart item not found")
    }

    mockCartItems.splice(itemIndex, 1)
  },
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      queryFn: async () => {
        try {
          const data = await mockCart.getCart()
          return { data }
        } catch (error) {
          return {
            error: { status: 500, data: { message: error instanceof Error ? error.message : "Failed to fetch cart" } },
          }
        }
      },
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<CartItem, { productId: string; quantity: number }>({
      queryFn: async (item) => {
        try {
          const data = await mockCart.addToCart(item)
          return { data }
        } catch (error) {
          return {
            error: { status: 400, data: { message: error instanceof Error ? error.message : "Failed to add to cart" } },
          }
        }
      },
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartItem, { id: string; quantity: number }>({
      queryFn: async ({ id, quantity }) => {
        try {
          const data = await mockCart.updateCartItem({ id, quantity })
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to update cart item" },
            },
          }
        }
      },
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await mockCart.removeFromCart(id)
          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to remove from cart" },
            },
          }
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } = cartApi
