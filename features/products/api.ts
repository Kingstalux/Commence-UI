import { baseApi } from "@/lib/api-base";
import type { Product, ProductFilters } from "./types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductFilters | void>({
      query: (filters: ProductFilters = {}) => {
        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.search) params.append("search", filters.search);
        if (filters.inStock !== undefined)
          params.append("inStock", filters.inStock.toString());
        if (filters.minPrice !== undefined)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", filters.maxPrice.toString());
        if (filters.sortBy) params.append("sortBy", filters.sortBy);

        return {
          url: "products",
          params: Object.fromEntries(params),
        };
      },
      transformResponse: (response: any[]) => {
        // Transform backend product format to frontend format
        return response.map((product) => ({
          ...product,
          id: product._id || product.id,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        }));
      },
      providesTags: ["Product"],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => "products/featured",
      transformResponse: (response: any[]) => {
        return response.map((product) => ({
          ...product,
          id: product._id || product.id,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        }));
      },
      providesTags: ["Product"],
    }),
    getCategories: builder.query<string[], void>({
      query: () => "products/categories",
      providesTags: ["Product"],
    }),
    searchProducts: builder.query<Product[], string>({
      query: (searchQuery) => ({
        url: "products/search",
        params: { q: searchQuery },
      }),
      transformResponse: (response: any[]) => {
        return response.map((product) => ({
          ...product,
          id: product._id || product.id,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        }));
      },
      providesTags: ["Product"],
    }),
    // Admin endpoints for product management
    createProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (product) => ({
        url: "admin/products",
        method: "POST",
        body: product,
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; updates: Partial<Product> }
    >({
      query: ({ id, updates }) => ({
        url: `admin/products/${id}`,
        method: "PUT",
        body: updates,
      }),
      transformResponse: (response: any) => ({
        ...response,
        id: response._id || response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
