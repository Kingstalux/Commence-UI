import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApi } from "@/features/auth/api"
import { productsApi } from "@/features/products/api"
import { cartApi } from "@/features/cart/api"
import { discountsApi } from "@/features/discounts/api"
import { transactionsApi } from "@/features/transactions/api"
import { paymentsApi } from "@/features/payments/api"
import authReducer from "@/features/auth/slice"
import cartReducer from "@/features/cart/slice"
import featureFlagsReducer from "@/features/feature-flags/slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    featureFlags: featureFlagsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [discountsApi.reducerPath]: discountsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
      discountsApi.middleware,
      transactionsApi.middleware,
      paymentsApi.middleware,
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
