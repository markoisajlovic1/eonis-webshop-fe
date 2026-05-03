import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { CreateCheckoutSessionDTO, CheckoutSessionResult, PaymentError } from '../types/payment';

class PaymentService {
  private readonly ENDPOINT = '/api/payments';

  async createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<CheckoutSessionResult> {
    try {
      const { data } = await axiosInstance.post<CheckoutSessionResult>(
        `${this.ENDPOINT}/create-checkout-session`,
        dto
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): PaymentError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 400) return { message: 'Invalid checkout data', statusCode };
      if (statusCode === 500) return { message: 'Server error, please try again later', statusCode };

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const paymentService = new PaymentService();
