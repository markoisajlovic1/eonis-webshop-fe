export interface CartItemDTO {
  userId: string
  productId: string
  quantity: number
}

export interface CreateCartItemDTO {
  userId: string
  productId: string
  quantity: number
}

export interface UpdateCartItemDTO {
  quantity: number
}

export interface CartError {
  message: string
  statusCode?: number
}

// Local storage cart item (no userId needed, stored per browser)
export interface LocalCartItem {
  productId: string
  productName: string
  price: number
  image: string
  quantity: number
}
