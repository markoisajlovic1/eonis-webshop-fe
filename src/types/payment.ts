export interface CheckoutItemDTO {
  productId: string
  quantity: number
}

export interface CreateAddressDTO {
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: number
  doorNumber: string
}

export interface CreateCheckoutSessionDTO {
  userId?: string | null
  addressId?: string | null
  email?: string | null
  items: CheckoutItemDTO[]
  address?: CreateAddressDTO
}

export interface CashPaymentDTO {
  userId?: string | null
  addressId?: string | null
  email?: string | null
  items: CheckoutItemDTO[]
  address?: CreateAddressDTO
}

export interface CheckoutSessionResult {
  url: string
  sessionId: string
}

export interface PaymentError {
  message: string
  statusCode?: number
}
