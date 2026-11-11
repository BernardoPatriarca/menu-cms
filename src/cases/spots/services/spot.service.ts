import { api } from "@/lib/axios"
import type { CreateSpotDTO, SpotDTO, UpdateSpotDTO } from "../dtos/spot.dto"

const ENDPOINT = "/spots"

export const SpotService = {
  async list(): Promise<SpotDTO[]> {
    const { data } = await api.get<SpotDTO[]>(ENDPOINT)
    return data
  },

  async create(dto: CreateSpotDTO): Promise<SpotDTO> {
    const { data } = await api.post<SpotDTO>(ENDPOINT, dto)
    return data
  },

  async update(id: string, dto: UpdateSpotDTO): Promise<SpotDTO> {
    const { data } = await api.patch<SpotDTO>(`${ENDPOINT}/${id}`, dto)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
