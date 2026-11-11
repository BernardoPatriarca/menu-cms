import { api } from "@/lib/axios"
import type {
  CategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dtos/category.dto"

const ENDPOINT = "/categories"

export const CategoryService = {
  async list(): Promise<CategoryDTO[]> {
    const { data } = await api.get<CategoryDTO[]>(ENDPOINT)
    return data
  },

  async create(dto: CreateCategoryDTO): Promise<CategoryDTO> {
    const { data } = await api.post<CategoryDTO>(ENDPOINT, dto)
    return data
  },

  async update(id: string, dto: UpdateCategoryDTO): Promise<CategoryDTO> {
    const { data } = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, dto)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
