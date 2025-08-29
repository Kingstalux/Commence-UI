import { baseApi } from "@/lib/api-base"
import type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "./types"
import { MOCK_USERS } from "@/lib/mock-data"

// Mock authentication logic
const mockAuth = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const mockUser = Object.values(MOCK_USERS).find(
      (user) => user.email === credentials.email && user.password === credentials.password,
    )

    if (!mockUser) {
      throw new Error("Invalid credentials")
    }

    const user: User = {
      id: mockUser.role === "ADMIN" ? "admin1" : "user1",
      email: mockUser.email,
      name: mockUser.role === "ADMIN" ? "Admin User" : "Test User",
      role: mockUser.role,
      avatarUrl: mockUser.role === "ADMIN" ? "/admin-avatar.png" : "/user-avatar.png",
    }

    return {
      user,
      token: `mock-jwt-token-${user.id}`,
    }
  },

  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: "USER",
      avatarUrl: "/user-avatar.png",
    }

    return {
      user,
      token: `mock-jwt-token-${user.id}`,
    }
  },

  getMe: async (): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return current user based on stored token (simplified)
    return {
      id: "user1",
      email: "user@test.com",
      name: "Test User",
      role: "USER",
      avatarUrl: "/user-avatar.png",
    }
  },

  updateProfile: async (updates: UpdateProfileRequest): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate updating user profile
    return {
      id: "user1",
      email: updates.email || "user@test.com",
      name: updates.name || "Test User",
      role: "USER",
      avatarUrl: updates.avatarUrl || "/user-avatar.png",
    }
  },

  changePassword: async (passwordData: ChangePasswordRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate password validation
    if (passwordData.currentPassword !== "password123") {
      throw new Error("Current password is incorrect")
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters")
    }

    // Password changed successfully
  },
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async (credentials) => {
        try {
          const data = await mockAuth.login(credentials)
          return { data }
        } catch (error) {
          return { error: { status: 401, data: { message: error instanceof Error ? error.message : "Login failed" } } }
        }
      },
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      queryFn: async (userData) => {
        try {
          const data = await mockAuth.signup(userData)
          return { data }
        } catch (error) {
          return { error: { status: 400, data: { message: error instanceof Error ? error.message : "Signup failed" } } }
        }
      },
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      queryFn: async () => {
        try {
          const data = await mockAuth.getMe()
          return { data }
        } catch (error) {
          return { error: { status: 401, data: { message: "Unauthorized" } } }
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      queryFn: async (updates) => {
        try {
          const data = await mockAuth.updateProfile(updates)
          return { data }
        } catch (error) {
          return { error: { status: 400, data: { message: error instanceof Error ? error.message : "Update failed" } } }
        }
      },
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      queryFn: async (passwordData) => {
        try {
          await mockAuth.changePassword(passwordData)
          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: error instanceof Error ? error.message : "Password change failed" },
            },
          }
        }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { data: undefined }
      },
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi
