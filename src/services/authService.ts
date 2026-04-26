import axiosInstance from './api/axiosInstance';
import { AxiosError } from 'axios';
import type { RegisterPayload, User, AuthError, LoginResponse, TokenResponse, RegisterResponse, DecodedToken } from '../types/auth';
import { Role } from '../types/auth';

export const CLAIMS = {
  ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
} as const;

class AuthService {
  private readonly AUTH_ENDPOINT = '/api/Auth';
  private accessToken: string | null = null;
  private username: string | null = null;

  async login(email: string, password: string): Promise<void> {
    try {
      const { data } = await axiosInstance.post<LoginResponse>(
        `${this.AUTH_ENDPOINT}/login`,
        { email, password }
      );

      this.setToken(data.accessToken);
      this.username = this.getUserFromToken()?.[CLAIMS.NAME] ?? null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const { data } = await axiosInstance.post<RegisterResponse>(
        `${this.AUTH_ENDPOINT}/register`,
        payload
      );

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.AUTH_ENDPOINT}/logout`);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local token
      this.removeToken();
    }
  }

  //---------------------------------------------

  async getMe(): Promise<User> {
    try {
      const { data } = await axiosInstance.get<User>(`${this.AUTH_ENDPOINT}/me`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const { data } = await axiosInstance.post<TokenResponse>(
        `${this.AUTH_ENDPOINT}/refresh`
      );
      // Update access token in memory
      this.setToken(data.access_token);
      return data.access_token;
    } catch (error) {
      this.removeToken();
      throw this.handleError(error);
    }
  }

  private setToken(token: string): void {
    this.accessToken = token;
  }

  private removeToken(): void {
    this.accessToken = null;
    this.username = null;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getUsername(): string | null {
    return this.username;
  }

  getEmail(): string | null {
    return this.getUserFromToken()?.[CLAIMS.EMAIL] ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserFromToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as DecodedToken;
    } catch {
      return null;
    }
  }

  getRole(): Role | null {
    const decoded = this.getUserFromToken();
    if (!decoded) return null;
    // const raw = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // const role = Array.isArray(raw) ? raw[0] : raw;
    const role = this.getClaim(decoded, CLAIMS.ROLE);
    return role ?? null;
  }

  getClaim(decoded: Record<string, unknown>, claim: string): Role | null {
    const raw = decoded[claim];
    const value = Array.isArray(raw) ? raw[0] : raw;
    
    switch (value) {
      case Role.Employee: return Role.Employee;
      case Role.Customer: return Role.Customer;
      default: return null;
    }
  }



  // Error handling --------------------------------------

  private handleError(error: unknown): AuthError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const statusCode = error.response?.status;

      if (statusCode === 401) {
        return { message: 'Invalid credentials', statusCode };
      }

      if (statusCode === 404) {
        return { message: 'Service not found', statusCode };
      }

      if (statusCode === 500) {
        return { message: 'Server error, please try again later', statusCode };
      }

      return { message, statusCode };
    }

    return { message: 'An unexpected error occurred' };
  }
}

export const authService = new AuthService();