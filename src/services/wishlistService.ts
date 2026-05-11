import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { WishlistItemDTO, CreateWishlistItemDTO, WishlistFilterParams, WishlistFilterResult, WishlistError } from '../types/wishlist';
import type { ProductDTO } from '../types/product';

class WishlistService {
  private readonly ENDPOINT = '/api/WishlistItem';

  async getByUserId(userId: string, params?: WishlistFilterParams): Promise<WishlistFilterResult<ProductDTO>> {
    try {
      const { data } = await axiosInstance.get<WishlistFilterResult<ProductDTO>>(`${this.ENDPOINT}/user/${userId}`, { params });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async add(dto: CreateWishlistItemDTO): Promise<WishlistItemDTO> {
    try {
      const { data } = await axiosInstance.post<WishlistItemDTO>(this.ENDPOINT, dto);
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

  private handleError(error: unknown): WishlistError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Wishlist item not found', statusCode };
      if (statusCode === 409) return { message: 'Item already in wishlist', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const wishlistService = new WishlistService();
