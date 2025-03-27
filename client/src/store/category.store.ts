import { create } from "zustand"
import { CategoryService } from "../services/category.service"
import type { Category, CategoryRequestDto } from "../types/category.types"

interface CategoryState {
  categories: Category[]
  selectedCategory: Category | null
  isLoading: boolean
  error: string | null

  fetchAllCategories: () => Promise<void>
  fetchCategoryById: (id: number) => Promise<void>
  createCategory: (categoryData: CategoryRequestDto) => Promise<void>
  updateCategory: (id: number, categoryData: CategoryRequestDto) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
  setSelectedCategory: (category: Category | null) => void
  clearError: () => void
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchAllCategories: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await CategoryService.getAllCategories()
      set({ categories: response, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      })
    }
  },

  fetchCategoryById: async (categoryId) => {
    try {
      set({ isLoading: true, error: null })
      const response = await CategoryService.getCategoryById(categoryId)
      set({ selectedCategory: response, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch category with ID: ${categoryId}`,
      })
    }
  },

  createCategory: async (categoryData) => {
    try {
      set({ isLoading: true, error: null })
      const newCategory = await CategoryService.createCategory(categoryData)
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create category",
      })
      return Promise.reject(error)
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      set({ isLoading: true, error: null })
      const updatedCategory = await CategoryService.updateCategory(id, categoryData)
      set((state) => ({
        categories: state.categories.map((category) => (category.id === id ? updatedCategory : category)),
        selectedCategory: state.selectedCategory?.id === id ? updatedCategory : state.selectedCategory,
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update category with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await CategoryService.deleteCategory(id)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to delete category with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
  },

  clearError: () => {
    set({ error: null })
  },
}))


