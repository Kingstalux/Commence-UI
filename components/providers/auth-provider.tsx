"use client";

import type React from "react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/features/auth/api";
import {
  setUser,
  clearUser,
  refreshTokenExpiration,
  hydrateAuthState,
} from "@/features/auth/slice";
import { TokenStorage } from "@/lib/token-storage";
import type { RootState } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Hydrate auth state from storage on mount
  useEffect(() => {
    dispatch(hydrateAuthState());
  }, [dispatch]);

  // Only fetch user data if we have a valid token
  const shouldSkipQuery = !TokenStorage.isTokenValid();
  const {
    data: user,
    error,
    isLoading,
  } = useGetMeQuery(undefined, {
    skip: shouldSkipQuery,
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
      // Refresh token expiration on successful user fetch
      dispatch(refreshTokenExpiration());
    } else if (error) {
      // Clear auth state if API call fails (token might be invalid)
      dispatch(clearUser());
    }
  }, [user, error, dispatch]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const checkTokenExpiration = () => {
      if (TokenStorage.isTokenExpiringSoon()) {
        // Refresh token expiration if user is active
        dispatch(refreshTokenExpiration());
      }
    };

    // Check token expiration every 30 minutes
    const interval = setInterval(checkTokenExpiration, 30 * 60 * 1000);

    // Also check on user activity
    const handleUserActivity = () => {
      if (TokenStorage.isTokenExpiringSoon()) {
        dispatch(refreshTokenExpiration());
      }
    };

    // Listen for user activity events
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, token, dispatch]);

  return <>{children}</>;
}
