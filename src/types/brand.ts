export interface BrandDTO {
  brandId: string
  brandName: string
  brandImage: string
  brandInfo: string
}

export interface CreateBrandDTO {
  brandName: string
  brandImage: string
  brandInfo: string
}

export interface UpdateBrandDTO {
  brandName: string
  brandImage: string
  brandInfo: string
}

export interface BrandError {
  message: string
  statusCode?: number
}

export type BrandSort = 'NameAsc' | 'NameDesc'

export interface BrandFilterParams {
  term?: string
  sort?: BrandSort
  pageNumber?: number
  pageSize?: number
}

export interface BrandFilterResult {
  items: BrandDTO[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
