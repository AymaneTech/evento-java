import { create } from "zustand"
import { UserService } from "../services/user.service"
import type { UserResponseDto, UpdateUserRequestDto } from "../types/user.types"
import { parseApiError } from "../lib/errors.util"

interface UserState {
  users: UserResponseDto[]
  selectedUser: UserResponseDto | null
  isLoading: boolean
  error: string | null
  parsedError: string | null

  fetchAllUsers: () => Promise<void>
  fetchUserById: (id: number) => Promise<void>
  updateUser: (id: number, userData: UpdateUserRequestDto) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  setSelectedUser: (user: UserResponseDto | null) => void
  clearError: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  parsedError: null,

  fetchAllUsers: async () => {
    try {
      set({ isLoading: true, error: null, parsedError: null })
      const users = await UserService.getAllUsers()
      set({ users, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users"
      set({
        isLoading: false,
        error: errorMessage,
        parsedError: parseApiError(errorMessage),
      })
      throw error
    }
  },

  fetchUserById: async (id) => {
    try {
      set({ isLoading: true, error: null, parsedError: null })
      const user = await UserService.getUserById(id)
      set({ selectedUser: user, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch user with ID: ${id}`
      set({
        isLoading: false,
        error: errorMessage,
        parsedError: parseApiError(errorMessage),
      })
      throw error
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null, parsedError: null })
      const updatedUser = await UserService.updateUser(id, userData)

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to update user with ID: ${id}`
      set({
        isLoading: false,
        error: errorMessage,
        parsedError: parseApiError(errorMessage),
      })
      throw error
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null, parsedError: null })
      await UserService.deleteUser(id)

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete user with ID: ${id}`
      set({
        isLoading: false,
        error: errorMessage,
        parsedError: parseApiError(errorMessage),
      })
      throw error
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user })
  },

  clearError: () => {
    set({ error: null, parsedError: null })
  },
}))


