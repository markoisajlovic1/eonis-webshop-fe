import axiosInstance from './api/axiosInstance'
import { AxiosError } from 'axios'
import type {
  CategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  SubcategoryDTO,
  CreateSubcategoryDTO,
  UpdateSubcategoryDTO,
  CategoryError,
} from '../types/categories'

class CategoryService {
  private readonly CATEGORY_ENDPOINT = '/api/Category'
  private readonly SUBCATEGORY_ENDPOINT = '/api/Subcategory'

  async getAllCategories(): Promise<CategoryDTO[]> {
    try {
      const { data } = await axiosInstance.get<CategoryDTO[]>(this.CATEGORY_ENDPOINT)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCategoryById(id: string): Promise<CategoryDTO> {
    try {
      const { data } = await axiosInstance.get<CategoryDTO>(`${this.CATEGORY_ENDPOINT}/${id}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createCategory(dto: CreateCategoryDTO): Promise<CategoryDTO> {
    try {
      const { data } = await axiosInstance.post<CategoryDTO>(this.CATEGORY_ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<CategoryDTO> {
    try {
      const { data } = await axiosInstance.put<CategoryDTO>(`${this.CATEGORY_ENDPOINT}/${id}`, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.CATEGORY_ENDPOINT}/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getAllSubcategories(): Promise<SubcategoryDTO[]> {
    try {
      const { data } = await axiosInstance.get<SubcategoryDTO[]>(this.SUBCATEGORY_ENDPOINT)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getSubcategoriesByCategoryId(categoryId: string): Promise<SubcategoryDTO[]> {
    try {
      const { data } = await axiosInstance.get<SubcategoryDTO[]>(
        `${this.SUBCATEGORY_ENDPOINT}/category/${categoryId}`
      )
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createSubcategory(dto: CreateSubcategoryDTO): Promise<SubcategoryDTO> {
    try {
      const { data } = await axiosInstance.post<SubcategoryDTO>(this.SUBCATEGORY_ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateSubcategory(id: string, dto: UpdateSubcategoryDTO): Promise<SubcategoryDTO> {
    try {
      const { data } = await axiosInstance.put<SubcategoryDTO>(
        `${this.SUBCATEGORY_ENDPOINT}/${id}`,
        dto
      )
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteSubcategory(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.SUBCATEGORY_ENDPOINT}/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): CategoryError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const statusCode = error.response?.status

      if (statusCode === 404) return { message: 'Not found', statusCode }
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode }

      return { message, statusCode }
    }

    return { message: 'An unexpected error occurred' }
  }
}

export const categoryService = new CategoryService()
