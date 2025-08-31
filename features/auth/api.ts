import { baseApi } from "@/lib/api-base";
import type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (updates) => ({
        url: "users/profile",
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "users/password",
        method: "PUT",
        body: passwordData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
