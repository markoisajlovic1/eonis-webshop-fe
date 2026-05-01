export interface ProductDTO {
  productId: string
  productName: string
  price: number
  discount: number
  quantity: number
  brandId: string
  desc: string
  subcategoryId: string
  images: string[]
}

export interface CreateProductDTO {
  productName: string
  price: number
  discount: number
  quantity: number
  brandId: string
  desc: string
  subcategoryId: string
  productImageUrls: string[]
}

export interface UpdateProductDTO {
  productName: string
  price: number
  discount: number
  quantity: number
  brandId: string
  desc: string
  subcategoryId: string
  productImageUrls: string[]
}

export interface ProductError {
  message: string
  statusCode?: number
}

export type ProductSort = 'NameAsc' | 'NameDesc' | 'PriceAsc' | 'PriceDesc'

export interface ProductFilterParams {
  term?: string
  categoryId?: string
  subcategoryId?: string
  sort?: ProductSort
  isPublished?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface ProductFilterResult {
  items: ProductDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
