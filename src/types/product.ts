export interface ImageDTO {
  imageId: string
  productId: string
  imageLink: string
  position: number
}

export interface ProductCategoryInfoDTO {
  subcategoryId: string
  subcategoryName: string
  categoryId: string
  categoryName: string
}

export interface ProductDTO {
  productId: string
  productName: string
  price: number
  discount: number
  quantity: number
  brandId: string
  brandName: string
  desc: string
  subcategory: ProductCategoryInfoDTO
  isPublished: boolean
  images: ImageDTO[]
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

export interface PublicProductFilterParams {
  term?: string
  category?: string
  subcategory?: string[]
  brand?: string[]
  priceMin?: number
  priceMax?: number
  sort?: ProductSort
  pageNumber?: number
  pageSize?: number
}

export interface ProductFilterParams {
  term?: string
  categoryId?: string
  subcategoryId?: string
  brandId?: string
  sort?: ProductSort
  isPublished?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface PublicProductPaginationDTO {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PublicProductFiltersDTO {
  minPrice: number
  maxPrice: number
}

export interface PublicProductResultDTO {
  items: ProductDTO[]
  pagination: PublicProductPaginationDTO
  filters: PublicProductFiltersDTO
}

export interface ProductFilterResult {
  items: ProductDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
