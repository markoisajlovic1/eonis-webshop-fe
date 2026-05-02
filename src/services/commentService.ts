import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { CommentDTO, ProductCommentDTO, CreateCommentDTO, UpdateCommentDTO, CommentError } from '../types/comment';

class CommentService {
  private readonly ENDPOINT = '/api/Comment';

  async getAll(): Promise<CommentDTO[]> {
    try {
      const { data } = await axiosInstance.get<CommentDTO[]>(this.ENDPOINT);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByProductId(productId: string): Promise<ProductCommentDTO[]> {
    try {
      const { data } = await axiosInstance.get<ProductCommentDTO[]>(`${this.ENDPOINT}/product/${productId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<CommentDTO> {
    try {
      const { data } = await axiosInstance.get<CommentDTO>(`${this.ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(dto: CreateCommentDTO): Promise<CommentDTO> {
    try {
      const { data } = await axiosInstance.post<CommentDTO>(this.ENDPOINT, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateCommentDTO): Promise<CommentDTO> {
    try {
      const { data } = await axiosInstance.put<CommentDTO>(`${this.ENDPOINT}/${id}`, dto);
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

  private handleError(error: unknown): CommentError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Comment not found', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const commentService = new CommentService();
