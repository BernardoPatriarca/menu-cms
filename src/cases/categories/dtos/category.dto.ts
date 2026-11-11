export interface CategoryDTO {
  id: string
  name: string
  active: boolean
}

export interface CreateCategoryDTO {
  name: string
}

export interface UpdateCategoryDTO {
  name?: string
  active?: boolean
}
