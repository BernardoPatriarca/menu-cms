import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"

export type GuestCheckStatus = "OPENED" | "CLOSED"

export interface GuestCheckDTO {
  id: string
  createdAt: string
  status: GuestCheckStatus
  spot: SpotDTO
}
