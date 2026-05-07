import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { OrderDTO, OrderFilterDTO, OrderItemWithProductDTO, CreateOrderDTO, UpdateOrderDTO, OrderFilterParams, OrderFilterResult, OrderError } from '../types/order';

class OrderService {
  private readonly ENDPOINT = '/api/Order';

  async getAll(): Promise<OrderDTO[]> {
    try {
      const { data } = await axiosInstance.get<OrderDTO[]>(this.ENDPOINT);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async filter(params: OrderFilterParams): Promise<OrderFilterResult> {
    try {
      const { data } = await axiosInstance.get<OrderFilterResult>(`${this.ENDPOINT}/filter`, { params });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<OrderFilterDTO> {
    try {
      const { data } = await axiosInstance.get<OrderFilterDTO>(`${this.ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getItemsByOrderId(orderId: string): Promise<OrderItemWithProductDTO[]> {
    try {
      const { data } = await axiosInstance.get<OrderItemWithProductDTO[]>(`/api/OrderItem/order/${orderId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUserId(userId: string): Promise<OrderDTO[]> {
    try {
      const { data } = await axiosInstance.get<OrderDTO[]>(`${this.ENDPOINT}/user/${userId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(dto: CreateOrderDTO): Promise<OrderDTO> {
    try {
      const { data } = await axiosInstance.post<OrderDTO>(this.ENDPOINT, dto);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateOrderDTO): Promise<OrderDTO> {
    try {
      const { data } = await axiosInstance.put<OrderDTO>(`${this.ENDPOINT}/${id}`, dto);
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

  private handleError(error: unknown): OrderError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 404) return { message: 'Order not found', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const orderService = new OrderService();
