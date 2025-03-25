import apiClient, { setAuthTokens, handleLogout } from "../api/axios"
import { storeUserInfoFromToken } from "../lib/jwt.util"
import type {
  RegisterNewUserRequestDto,
  UserLoginRequestDto,
  ChangePasswordRequestDto,
  AuthenticationResponseDto,
  UserResponseDto,
  UpdateUserRequestDto,
} from "../types/auth.types"

const API_PATH = "/auth"

export const AuthService = {
  register: async (userData: RegisterNewUserRequestDto): Promise<UserResponseDto> => {
    const response = await apiClient.post<UserResponseDto>(`${API_PATH}/register`, userData)
    return response.data
  },

  login: async (credentials: UserLoginRequestDto): Promise<AuthenticationResponseDto> => {
    const response = await apiClient.post<AuthenticationResponseDto>(`${API_PATH}/login`, credentials)

    if (response.data && response.data.token) {
      setAuthTokens(response.data.token, response.data.refreshToken)
      storeUserInfoFromToken(response.data.token)
    }

    return response.data
  },

  changePassword: async (passwordData: ChangePasswordRequestDto): Promise<void> => {
    await apiClient.post(`${API_PATH}/change-password`, passwordData)
  },

  refreshToken: async (refreshToken: string): Promise<AuthenticationResponseDto> => {
    const response = await apiClient.post<AuthenticationResponseDto>(`${API_PATH}/refresh`, { refreshToken })

    if (response.data && response.data.token && response.data.refreshToken) {
      setAuthTokens(response.data.token, response.data.refreshToken)
      storeUserInfoFromToken(response.data.token)
    }

    return response.data
  },

  logout: (): void => {
    handleLogout()
  },

  getCurrentUser: async (): Promise<UserResponseDto> => {
    const response = await apiClient.get<UserResponseDto>(`${API_PATH}/me`)
    return response.data
  },

  updateProfile: async (userData: UpdateUserRequestDto): Promise<UserResponseDto> => {
    const response = await apiClient.put<UserResponseDto>(`${API_PATH}`, userData)
    return response.data
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete(`${API_PATH}`)
    handleLogout()
  },
}


