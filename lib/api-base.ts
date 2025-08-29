import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json")
    return headers
  },
})

export { baseQuery }

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)

    // Handle 401 errors globally
    if (result.error?.status === 401) {
      // Could dispatch logout action here
      window.location.href = "/login"
    }

    return result
  },
  tagTypes: ["User", "Product", "Cart", "Discount", "Transaction"],
  endpoints: () => ({}),
})
