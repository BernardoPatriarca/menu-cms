import type { GuestCheckDTO } from "@/cases/guest-checks/dtos/guest-check.dto"
import type { ProductDTO } from "@/cases/products/dtos/product.dto"

export type OrderStatus = "NEW" | "PREPARING" | "READY" | "DELIVERY"

export interface OrderItemDTO {
  id: string
  quantity: number
  price: string | number
  subtotal: string | number
  product: ProductDTO
}

export interface OrderDTO {
  id: string
  createdAt: string
  total: string | number
  status: OrderStatus
  guestCheck: GuestCheckDTO
  items: OrderItemDTO[]
}
