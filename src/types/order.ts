export type OrderSort = 'DateAsc' | 'DateDesc'

export interface OrderDTO {
  orderId: string
  userId: string
  date: string
  codeId: string | null
}

export interface CreateOrderDTO {
  userId: string
  date: string
  codeId?: string
}

export interface UpdateOrderDTO {
  date: string
  codeId?: string
}

export interface OrderFilterParams {
  sort?: OrderSort
  pageNumber?: number
  pageSize?: number
}

export interface OrderFilterResult {
  items: OrderDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface OrderItemWithProductDTO {
  orderId: string
  product: {
    productId: string
    productName: string
    price: number
    discount: number
    images: { imageLink: string }[]
  }
  quantity: number
}

export interface OrderError {
  message: string
  statusCode?: number
}
