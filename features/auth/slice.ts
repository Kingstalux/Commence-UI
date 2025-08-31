import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";
import { authApi } from "./api";
import { TokenStorage } from "@/lib/token-storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Always start with empty state to avoid hydration issues
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      // Clear token from storage
      TokenStorage.clearToken();
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store token with expiration
      TokenStorage.setToken(action.payload.token, action.payload.user);
    },
    refreshTokenExpiration: (state) => {
      // Extend token expiration by another 24 hours
      if (state.token) {
        TokenStorage.refreshTokenExpiration();
      }
    },
    hydrateAuthState: (state) => {
      // Hydrate auth state from storage after component mounts
      if (typeof window === "undefined") return;

      // Migrate existing tokens to new format
      TokenStorage.migrateExistingToken();

      const tokenData = TokenStorage.getTokenData();
      if (tokenData) {
        state.user = tokenData.user || null;
        state.isAuthenticated = !!tokenData.user;
        state.token = tokenData.token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          // Store token with expiration
          TokenStorage.setToken(payload.token, payload.user);
        }
      )
      .addMatcher(
        authApi.endpoints.signup.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          // Store token with expiration
          TokenStorage.setToken(payload.token, payload.user);
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Clear token from storage
        TokenStorage.clearToken();
      });
  },
});

export const {
  setUser,
  clearUser,
  setCredentials,
  refreshTokenExpiration,
  hydrateAuthState,
} = authSlice.actions;
export default authSlice.reducer;
