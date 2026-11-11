import { api } from "@/lib/axios"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"

const ENDPOINT = "/orders"

export const OrderService = {
  async list(): Promise<OrderDTO[]> {
    const { data } = await api.get<OrderDTO[]>(ENDPOINT)
    return data
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
    const { data } = await api.patch<OrderDTO>(`${ENDPOINT}/${id}/status`, {
      status,
    })
    return data
  },
}
