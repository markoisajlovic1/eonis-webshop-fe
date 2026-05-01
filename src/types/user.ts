import type { Role } from './auth'

export interface UserDTO {
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: Role
}

export interface CreateUserDTO {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
  role: Role
}

export interface UpdateUserDTO {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: Role
}

export interface UserError {
  message: string
  statusCode?: number
}
