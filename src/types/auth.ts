// export interface RegisterDTO {
//   username: string;
//   email: string;
//   passwordHash?: string;
//   password?: string;
//   firstName: string;
//   lastName: string;
// }

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterFormData extends RegisterPayload {
  confirmPassword: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const Role = {
  Employee: 'Employee',
  Customer: 'Customer',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface LoginDTO {
  username: string;
  password?: string;
}

export interface LoginResponse {
  email: string;
  username: string;
  accessToken: string; 
  role: string;
}

export interface RegisterResponse {
  email: string;
  username: string;
  role: string;
}

export interface UserInfo {
  id: string;
  fullName: string;
  role: Role;
  isAuthenticated: boolean;
}

export interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: Role | Role[];
  exp: number;
  [key: string]: any;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

