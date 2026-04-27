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
