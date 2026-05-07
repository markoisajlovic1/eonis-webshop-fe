export type OrderSort = 'DateAsc' | 'DateDesc'

export type OrderStatus = 0 | 1 | 2

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  0: 'Primljeno',
  1: 'U obradi',
  2: 'Isporučeno',
}

export interface OrderDTO {
  orderId: string
  userId: string | null
  date: string
  couponCode: string | null
  addressId: string
  status: OrderStatus
  isPaid: boolean
}

export interface OrderFilterDTO {
  orderId: string
  userId: string | null
  username: string | null
  date: string
  couponCode: string | null
  addressId: string
  status: OrderStatus
  isPaid: boolean
}

export interface CreateOrderDTO {
  userId: string
  date: string
  codeId?: string
}

export interface UpdateOrderDTO {
  date: string
  couponCode?: string
  addressId: string
  status: OrderStatus
  isPaid: boolean
}

export interface OrderFilterParams {
  sort?: OrderSort
  isPaid?: boolean
  status?: OrderStatus
  pageNumber?: number
  pageSize?: number
}

export interface OrderFilterResult {
  items: OrderFilterDTO[]
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
