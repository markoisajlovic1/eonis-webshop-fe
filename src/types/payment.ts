export interface CheckoutItemDTO {
  productId: string
  quantity: number
}

export interface CreateCheckoutSessionDTO {
  userId: string
  items: CheckoutItemDTO[]
}

export interface CheckoutSessionResult {
  url: string
  sessionId: string
}

export interface PaymentError {
  message: string
  statusCode?: number
}
