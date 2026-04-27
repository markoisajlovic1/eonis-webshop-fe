import axiosInstance from './api/axiosInstance'
import { AxiosError } from 'axios'
import type { CouponDTO, CreateCouponDTO, UpdateCouponDTO, CouponError } from '../types/coupon'

class CouponService {
  private readonly ENDPOINT = '/api/DiscountCode'

  async getAll(): Promise<CouponDTO[]> {
    try {
      const { data } = await axiosInstance.get<CouponDTO[]>(this.ENDPOINT)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getById(id: string): Promise<CouponDTO> {
    try {
      const { data } = await axiosInstance.get<CouponDTO>(`${this.ENDPOINT}/${id}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getByCode(code: string): Promise<CouponDTO> {
    try {
      const { data } = await axiosInstance.get<CouponDTO>(`${this.ENDPOINT}/code/${code}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getByUserId(userId: string): Promise<CouponDTO[]> {
    try {
      const { data } = await axiosInstance.get<CouponDTO[]>(`${this.ENDPOINT}/user/${userId}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(dto: CreateCouponDTO): Promise<CouponDTO> {
    try {
      const { data } = await axiosInstance.post<CouponDTO>(this.ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: string, dto: UpdateCouponDTO): Promise<CouponDTO> {
    try {
      const { data } = await axiosInstance.put<CouponDTO>(`${this.ENDPOINT}/${id}`, dto)
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

  private handleError(error: unknown): CouponError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const statusCode = error.response?.status

      if (statusCode === 404) return { message: 'Coupon not found', statusCode }
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode }

      return { message, statusCode }
    }

    return { message: 'An unexpected error occurred' }
  }
}

export const couponService = new CouponService()
