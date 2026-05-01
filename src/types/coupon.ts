export interface CouponDTO {
  codeId: string
  code: string
  value: number
  userId: string
}

export interface CreateCouponDTO {
  code: string
  value: number
  userId: string
}

export interface UpdateCouponDTO {
  code: string
  value: number
  userId: string
}

export interface CouponError {
  message: string
  statusCode?: number
}

export type DiscountCodeSort = 'CodeAsc' | 'CodeDesc'

export interface CouponFilterParams {
  term?: string
  sort?: DiscountCodeSort
  pageNumber?: number
  pageSize?: number
}

export interface CouponFilterResult {
  items: CouponDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
