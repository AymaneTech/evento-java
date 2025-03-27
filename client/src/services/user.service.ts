import apiClient from "../api/axios"
import type { UserResponseDto, UpdateUserRequestDto } from "../types/user.types"

const API_PATH = "/v1/users"

export const UserService = {
  getUserById: async (id: number): Promise<UserResponseDto> => {
    const response = await apiClient.get<UserResponseDto>(`${API_PATH}/${id}`)
    return response.data
  },

  getAllUsers: async (): Promise<UserResponseDto[]> => {
    const response = await apiClient.get<UserResponseDto[]>(API_PATH)
    return response.data
  },

  updateUser: async (id: number, userData: UpdateUserRequestDto): Promise<UserResponseDto> => {
    const response = await apiClient.put<UserResponseDto>(`${API_PATH}/${id}`, userData)
    return response.data
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_PATH}/${id}`)
  },
}


