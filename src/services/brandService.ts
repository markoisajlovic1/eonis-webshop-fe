import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { BrandDTO, CreateBrandDTO, UpdateBrandDTO, BrandError } from '../types/brand';

class BrandService {
  private readonly ENDPOINT = '/api/Brand';

  async getAll(): Promise<BrandDTO[]> {
    try {
      const { data } = await axiosInstance.get<BrandDTO[]>(this.ENDPOINT);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<BrandDTO> {
    try {
      const { data } = await axiosInstance.get<BrandDTO>(`${this.ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(dto: CreateBrandDTO): Promise<BrandDTO> {
    try {
      const { data } = await axiosInstance.post<BrandDTO>(this.ENDPOINT, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateBrandDTO): Promise<BrandDTO> {
    try {
      const { data } = await axiosInstance.put<BrandDTO>(`${this.ENDPOINT}/${id}`, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): BrandError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Brand not found', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const brandService = new BrandService();
