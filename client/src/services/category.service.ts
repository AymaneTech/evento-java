import apiClient from "../api/axios"
import type { CategoryRequestDto, CategoryResponseDto } from "../types/category.types"

const API_PATH = "/v1/categories"

export const CategoryService = {
  createCategory: async (categoryData: CategoryRequestDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.post<CategoryResponseDto>(API_PATH, categoryData)
    return response.data
  },

  getCategoryById: async (id: number): Promise<CategoryResponseDto> => {
    const response = await apiClient.get<CategoryResponseDto>(`${API_PATH}/${id}`)
    return response.data
  },

  getAllCategories: async (): Promise<CategoryResponseDto[]> => {
    const response = await apiClient.get<CategoryResponseDto[]>(API_PATH)
    return response.data
  },

  updateCategory: async (id: number, categoryData: CategoryRequestDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.put<CategoryResponseDto>(`${API_PATH}/${id}`, categoryData)
    return response.data
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_PATH}/${id}`)
  },
}


