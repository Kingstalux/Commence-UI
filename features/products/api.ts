import { baseApi } from "@/lib/api-base"
import type { Product, ProductFilters } from "./types"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

// Mock products logic
const mockProducts = {
  getProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    let filteredProducts = [...MOCK_PRODUCTS]

    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === filters.category)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.inStock === filters.inStock)
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice!)
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case "price_asc":
            return a.price - b.price
          case "price_desc":
            return b.price - a.price
          case "name_asc":
            return a.name.localeCompare(b.name)
          case "name_desc":
            return b.name.localeCompare(a.name)
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          default:
            return 0
        }
      })
    }

    return filteredProducts
  },

  getProduct: async (id: string): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const product = MOCK_PRODUCTS.find((p) => p.id === id)
    if (!product) {
      throw new Error("Product not found")
    }
    return product
  },

  createProduct: async (productData: Omit<Product, "id">): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    MOCK_PRODUCTS.push(newProduct)
    return newProduct
  },

  updateProduct: async ({ id, updates }: { id: string; updates: Partial<Product> }): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    const updatedProduct = {
      ...MOCK_PRODUCTS[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    MOCK_PRODUCTS[productIndex] = updatedProduct
    return updatedProduct
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    MOCK_PRODUCTS.splice(productIndex, 1)
  },
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductFilters | void>({
      queryFn: async (filters = {}) => {
        try {
          const data = await mockProducts.getProducts(filters)
          return { data }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: error instanceof Error ? error.message : "Failed to fetch products" },
            },
          }
        }
      },
      providesTags: ["Product"],
    }),
    getProduct: builder.query<Product, string>({
      queryFn: async (id) => {
        try {
          const data = await mockProducts.getProduct(id)
          return { data }
        } catch (error) {
          return {
            error: { status: 404, data: { message: error instanceof Error ? error.message : "Product not found" } },
          }
        }
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, Omit<Product, "id">>({
      queryFn: async (product) => {
        try {
          const data = await mockProducts.createProduct(product)
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to create product" },
            },
          }
        }
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, { id: string; updates: Partial<Product> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const data = await mockProducts.updateProduct({ id, updates })
          return { data }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to update product" },
            },
          }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await mockProducts.deleteProduct(id)
          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Failed to delete product" },
            },
          }
        }
      },
      invalidatesTags: ["Product"],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
