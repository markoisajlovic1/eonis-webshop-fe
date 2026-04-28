export interface ProductDTO {
  productId: string
  productName: string
  price: number
  discount: number
  brandId: string
  desc: string
  subcategoryId: string
  productImageUrls: string[]
}

export interface CreateProductDTO {
  productName: string
  price: number
  discount: number
  brandId: string
  desc: string
  subcategoryId: string
  productImageUrls: string[]
}

export interface UpdateProductDTO {
  productName: string
  price: number
  discount: number
  brandId: string
  desc: string
  subcategoryId: string
  productImageUrls: string[]
}

export interface ProductError {
  message: string
  statusCode?: number
}
