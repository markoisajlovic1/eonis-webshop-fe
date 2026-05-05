import axiosInstance from './api/axiosInstance'
import { AxiosError } from 'axios'
import type { AddressDTO, CreateAddressDTO, UpdateAddressDTO, AddressError } from '../types/address'

class AddressService {
  private readonly ENDPOINT = '/api/Address'

  async getByUserId(userId: string): Promise<AddressDTO[]> {
    try {
      const { data } = await axiosInstance.get<AddressDTO[]>(`${this.ENDPOINT}/user/${userId}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(dto: CreateAddressDTO): Promise<AddressDTO> {
    try {
      const { data } = await axiosInstance.post<AddressDTO>(this.ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: string, dto: UpdateAddressDTO): Promise<AddressDTO> {
    try {
      const { data } = await axiosInstance.put<AddressDTO>(`${this.ENDPOINT}/${id}`, dto)
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

  private handleError(error: unknown): AddressError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const statusCode = error.response?.status

      if (statusCode === 404) return { message: 'Address not found', statusCode }
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode }

      return { message, statusCode }
    }

    return { message: 'An unexpected error occurred' }
  }
}

export const addressService = new AddressService()
