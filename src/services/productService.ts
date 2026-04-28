import axiosInstance from './api/axiosInstance'
import { AxiosError } from 'axios'
import type {
  ProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
  ProductError,
} from '../types/product'

class ProductService {
  private readonly ENDPOINT = '/api/Product'

  async getAll(): Promise<ProductDTO[]> {
    try {
      const { data } = await axiosInstance.get<ProductDTO[]>(this.ENDPOINT)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getById(id: string): Promise<ProductDTO> {
    try {
      const { data } = await axiosInstance.get<ProductDTO>(`${this.ENDPOINT}/${id}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getByBrandId(brandId: string): Promise<ProductDTO[]> {
    try {
      const { data } = await axiosInstance.get<ProductDTO[]>(`${this.ENDPOINT}/brand/${brandId}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getBySubcategoryId(subcategoryId: string): Promise<ProductDTO[]> {
    try {
      const { data } = await axiosInstance.get<ProductDTO[]>(`${this.ENDPOINT}/subcategory/${subcategoryId}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(dto: CreateProductDTO): Promise<ProductDTO> {
    try {
      const { data } = await axiosInstance.post<ProductDTO>(this.ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: string, dto: UpdateProductDTO): Promise<ProductDTO> {
    try {
      const { data } = await axiosInstance.put<ProductDTO>(`${this.ENDPOINT}/${id}`, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.ENDPOINT}/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): ProductError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const statusCode = error.response?.status

      if (statusCode === 404) return { message: 'Product not found', statusCode }
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode }

      return { message, statusCode }
    }

    return { message: 'An unexpected error occurred' }
  }
}

export const productService = new ProductService()
