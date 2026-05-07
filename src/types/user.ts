import type { Role } from './auth'
import type { AddressDTO } from './address'

export interface UserDetailsDTO {
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: Role
  addresses: AddressDTO[]
}

export type UserRole = Role | 0 | 1

export interface UserDTO {
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
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

export type UserSearchBy = 0 | 1 | 2
export type UserSort = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface UserFilterParams {
  role: 0 | 1
  term?: string
  searchBy?: UserSearchBy
  sort?: UserSort
  pageNumber?: number
  pageSize?: number
}

export interface UserFilterResult {
  items: UserDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface UserError {
  message: string
  statusCode?: number
}
