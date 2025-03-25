import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { AuthService } from "../services/auth.service"
import type {
  UserResponseDto,
  UserLoginRequestDto,
  RegisterNewUserRequestDto,
  ChangePasswordRequestDto,
  UpdateUserRequestDto,
} from "../types/auth.types"
import { ACCESS_TOKEN_KEY } from "../api/axios"
import Cookies from "js-cookie"
import { parseApiError } from "../lib/errors.util"
import { clearUserData, getRedirectPathByRole } from "../lib/jwt.util"

function getAuthToken() {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

interface AuthState {
  user: UserResponseDto | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  parsedError: string | null
  login: (credentials: UserLoginRequestDto) => Promise<string>
  register: (userData: RegisterNewUserRequestDto) => Promise<void>
  changePassword: (data: ChangePasswordRequestDto) => Promise<void>
  updateProfile: (data: UpdateUserRequestDto) => Promise<void>
  deleteAccount: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: !!getAuthToken(),
      isLoading: false,
      error: null,
      parsedError: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          const response = await AuthService.login(credentials)

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })

          // Return the redirect path based on user role
          return getRedirectPathByRole()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Login failed"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          await AuthService.register(userData)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Registration failed"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          await AuthService.changePassword(data)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Password change failed"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          const updatedUser = await AuthService.updateProfile(data)
          set({
            user: updatedUser,
            isLoading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Profile update failed"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      deleteAccount: async () => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          await AuthService.deleteAccount()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Account deletion failed"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null, parsedError: null })
          const user = await AuthService.getCurrentUser()
          set({
            user,
            isLoading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch user profile"
          set({
            isLoading: false,
            error: errorMessage,
            parsedError: parseApiError(errorMessage),
          })
          throw error
        }
      },

      logout: () => {
        AuthService.logout()
        clearUserData()
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      clearError: () => {
        set({ error: null, parsedError: null })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        // Note: We don't store isAuthenticated in sessionStorage as we'll check cookies
      }),
    },
  ),
)


