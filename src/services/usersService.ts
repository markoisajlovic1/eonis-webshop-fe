import axiosInstance from './api/axiosInstance'
import { AxiosError } from 'axios'
import type { UserDTO, CreateUserDTO, UpdateUserDTO, UserError } from '../types/user'

class UsersService {
  private readonly ENDPOINT = '/api/User'

  async getAll(): Promise<UserDTO[]> {
    try {
      const { data } = await axiosInstance.get<UserDTO[]>(this.ENDPOINT)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getById(id: string): Promise<UserDTO> {
    try {
      const { data } = await axiosInstance.get<UserDTO>(`${this.ENDPOINT}/${id}`)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(dto: CreateUserDTO): Promise<UserDTO> {
    try {
      const { data } = await axiosInstance.post<UserDTO>(this.ENDPOINT, dto)
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserDTO> {
    try {
      const { data } = await axiosInstance.put<UserDTO>(`${this.ENDPOINT}/${id}`, dto)
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

  private handleError(error: unknown): UserError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const statusCode = error.response?.status

      if (statusCode === 404) return { message: 'User not found', statusCode }
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode }

      return { message, statusCode }
    }

    return { message: 'An unexpected error occurred' }
  }
}

export const usersService = new UsersService()