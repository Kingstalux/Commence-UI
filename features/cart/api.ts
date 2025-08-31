import { baseApi } from "@/lib/api-base";
import type { Cart, CartItem } from "./types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => ({
        url: "cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<
      CartItem,
      { productId: string; quantity: number }
    >({
      query: (item) => ({
        url: "cart/items",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      CartItem,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `cart/items/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<void, string>({
      query: (id) => ({
        url: `cart/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    likeCartItem: builder.mutation<void, { itemId: string; liked: boolean }>({
      query: ({ itemId, liked }) => ({
        url: `cart/items/${itemId}/like`,
        method: "POST",
        body: { liked },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useLikeCartItemMutation,
  useClearCartMutation,
} = cartApi;
