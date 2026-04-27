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
