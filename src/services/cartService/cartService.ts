import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios';
import type { CartItemDTO, CreateCartItemDTO, UpdateCartItemDTO, CartError } from '../../types/cart';

class CartService {
  private readonly ENDPOINT = '/api/CartItem';

  async getByUserId(userId: string): Promise<CartItemDTO[]> {
    try {
      const { data } = await axiosInstance.get<CartItemDTO[]>(`${this.ENDPOINT}/user/${userId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getItem(userId: string, productId: string): Promise<CartItemDTO> {
    try {
      const { data } = await axiosInstance.get<CartItemDTO>(`${this.ENDPOINT}/user/${userId}/product/${productId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(dto: CreateCartItemDTO): Promise<CartItemDTO> {
    try {
      const { data } = await axiosInstance.post<CartItemDTO>(this.ENDPOINT, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(userId: string, productId: string, dto: UpdateCartItemDTO): Promise<CartItemDTO> {
    try {
      const { data } = await axiosInstance.put<CartItemDTO>(`${this.ENDPOINT}/user/${userId}/product/${productId}`, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async remove(userId: string, productId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.ENDPOINT}/user/${userId}/product/${productId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): CartError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Cart item not found', statusCode };
      if (statusCode === 409) return { message: 'Item already in cart', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const cartService = new CartService();
