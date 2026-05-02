import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type {
  ReviewDTO,
  ProductReviewAveragesDTO,
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewError,
} from '../types/review';

class ReviewService {
  private readonly ENDPOINT = '/api/Review';

  async getAll(): Promise<ReviewDTO[]> {
    try {
      const { data } = await axiosInstance.get<ReviewDTO[]>(this.ENDPOINT);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUserId(userId: string): Promise<ReviewDTO[]> {
    try {
      const { data } = await axiosInstance.get<ReviewDTO[]>(`${this.ENDPOINT}/user/${userId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByProductId(productId: string): Promise<ReviewDTO[]> {
    try {
      const { data } = await axiosInstance.get<ReviewDTO[]>(`${this.ENDPOINT}/product/${productId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAverages(productId: string): Promise<ProductReviewAveragesDTO> {
    try {
      const { data } = await axiosInstance.get<ProductReviewAveragesDTO>(`${this.ENDPOINT}/product/${productId}/averages`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<ReviewDTO> {
    try {
      const { data } = await axiosInstance.get<ReviewDTO>(`${this.ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(dto: CreateReviewDTO): Promise<ReviewDTO> {
    try {
      const { data } = await axiosInstance.post<ReviewDTO>(this.ENDPOINT, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateReviewDTO): Promise<ReviewDTO> {
    try {
      const { data } = await axiosInstance.put<ReviewDTO>(`${this.ENDPOINT}/${id}`, dto);
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

  private handleError(error: unknown): ReviewError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Review not found', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const reviewService = new ReviewService();
