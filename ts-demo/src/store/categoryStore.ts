import { create } from 'zustand'
import { categoryApi } from '../api/categoryApi'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../api/categoryApi'
import type { CategoryItem } from '../types/category'

export interface CategoryStoreState {
    categories: CategoryItem[]
    loading: boolean
    error?: string
    fetchCategories: () => Promise<void>
    addCategory: (category: CreateCategoryPayload) => Promise<void>
    updateCategory: (id: string, category: UpdateCategoryPayload) => Promise<void>
    removeCategory: (categoryId: string) => Promise<void>
    clearCategories: () => void
}

export const useCategoryStore = create<CategoryStoreState>((set) => ({
    categories: [],
    loading: false,
    error: undefined,

    fetchCategories: async () => {
        set({ loading: true, error: undefined })

        try {
            const categories = await categoryApi.getCategories()
            set({ categories, loading: false })
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : '分类加载失败',
            })
        }
    },

    addCategory: async (category: CreateCategoryPayload) => {
        const createdCategory = await categoryApi.createCategory(category)
        set((state) => ({ categories: [...state.categories, createdCategory] }))
    },

    updateCategory: async (id: string, category: UpdateCategoryPayload) => {
        const savedCategory = await categoryApi.updateCategory(id, category)
        set((state) => ({
            categories: state.categories.map((item) =>
                item.id === savedCategory.id ? savedCategory : item,
            ),
        }))
    },

    removeCategory: async (categoryId: string) => {
        await categoryApi.deleteCategory(categoryId)
        set((state) => ({
            categories: state.categories.filter((category) => category.id !== categoryId),
        }))
    },

    clearCategories: () => set({ categories: [], error: undefined }),
}))
