import { api } from "@/lib/axios"
import type {
  CreateProductDTO,
  ProductDTO,
  UpdateProductDTO,
} from "../dtos/product.dto"

const ENDPOINT = "/products"

export const ProductService = {
  async list(): Promise<ProductDTO[]> {
    const { data } = await api.get<ProductDTO[]>(ENDPOINT)
    return data
  },

  async create(dto: CreateProductDTO): Promise<ProductDTO> {
    const { data } = await api.post<ProductDTO>(ENDPOINT, dto)
    return data
  },

  async update(id: string, dto: UpdateProductDTO): Promise<ProductDTO> {
    const { data } = await api.patch<ProductDTO>(`${ENDPOINT}/${id}`, dto)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
