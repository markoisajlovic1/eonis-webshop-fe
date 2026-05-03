export interface WishlistItemDTO {
  userId: string
  productId: string
}

export interface CreateWishlistItemDTO {
  userId: string
  productId: string
}

export interface WishlistFilterParams {
  hasDiscount?: boolean
  sortAZ?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface WishlistFilterResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface WishlistError {
  message: string
  statusCode?: number
}
