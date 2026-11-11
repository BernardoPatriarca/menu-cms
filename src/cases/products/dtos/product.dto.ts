import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"

export interface ProductDTO {
  id: string
  name: string
  active: boolean
  description: string | null
  /** O TypeORM serializa colunas `numeric` como string. */
  price: string | number
  picture: string | null
  category?: CategoryDTO | null
}

export interface CreateProductDTO {
  name: string
  price: number
  description?: string
  categoryId?: string
  picture?: string
}

/** `null` limpa o campo na API (o validador `@IsOptional` aceita null). */
export interface UpdateProductDTO {
  name?: string
  price?: number
  description?: string | null
  categoryId?: string
  picture?: string | null
  active?: boolean
}
