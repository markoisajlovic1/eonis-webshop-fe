export interface CategoryDTO {
  categoryId: string
  name: string
}

export interface CreateCategoryDTO {
  name: string
}

export interface UpdateCategoryDTO {
  name: string
}

export interface SubcategoryDTO {
  subcategoryId: string
  categoryId: string
  name: string
}

export interface CreateSubcategoryDTO {
  categoryId: string
  name: string
}

export interface UpdateSubcategoryDTO {
  name: string
}

export interface CategoryError {
  message: string
  statusCode?: number
}
