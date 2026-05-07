import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { DashboardStatsDTO, DailyStatsDTO } from '../types/stats';

class StatsService {
  private readonly ENDPOINT = '/api/Stats';

  async getDashboard(): Promise<DashboardStatsDTO> {
    try {
      const { data } = await axiosInstance.get<DashboardStatsDTO>(`${this.ENDPOINT}/dashboard`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDateRange(from: Date, to: Date): Promise<DailyStatsDTO[]> {
    try {
      const fmt = (d: Date) => d.toISOString().split('T')[0];
      const { data } = await axiosInstance.get<DailyStatsDTO[]>(`${this.ENDPOINT}/range`, {
        params: { from: fmt(from), to: fmt(to) },
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): { message: string } {
    if (error instanceof AxiosError) {
      return { message: error.response?.data?.message || error.message || 'An error occurred' };
    }
    return { message: 'An unexpected error occurred' };
  }
}

export const statsService = new StatsService();
