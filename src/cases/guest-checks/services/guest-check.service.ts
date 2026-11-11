import { api } from "@/lib/axios"
import type { GuestCheckDTO, GuestCheckStatus } from "../dtos/guest-check.dto"

const ENDPOINT = "/guest-checks"

export const GuestCheckService = {
  async list(status?: GuestCheckStatus): Promise<GuestCheckDTO[]> {
    const { data } = await api.get<GuestCheckDTO[]>(ENDPOINT, {
      params: status ? { status } : undefined,
    })
    return data
  },
}
