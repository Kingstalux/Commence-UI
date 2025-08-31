import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/lib/api-base";
import authReducer from "@/features/auth/slice";
import cartReducer from "@/features/cart/slice";
import featureFlagsReducer from "@/features/feature-flags/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    featureFlags: featureFlagsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
