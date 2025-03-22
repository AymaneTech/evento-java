import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '../services/auth.service';
import type {
  UserResponseDto,
  UserLoginRequestDto,
  RegisterNewUserRequestDto,
  ChangePasswordRequestDto
} from '../types/auth.types';
import { ACCESS_TOKEN_KEY } from "../api/axios.ts";
import Cookies from "js-cookie";

interface AuthState {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: UserLoginRequestDto) => Promise<void>;
  register: (userData: RegisterNewUserRequestDto) => Promise<void>;
  changePassword: (data: ChangePasswordRequestDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: !!getAuthToken(),
      isLoading: false,
      error: null,

      login: async (credentials) => {
        console.log("lsjdfldsf");
        
        try {
          set({ isLoading: true, error: null });
          const response = await AuthService.login(credentials);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          await AuthService.register(userData);
          await get().login({
            email: userData.email,
            password: userData.password
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          throw error;
        }
      },

      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          await AuthService.changePassword(data);
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password change failed'
          });
          throw error;
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          isAuthenticated: false
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

function getAuthToken() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}
