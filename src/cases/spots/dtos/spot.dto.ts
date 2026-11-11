export interface SpotDTO {
  id: string
  name: string
  active: boolean
}

export interface CreateSpotDTO {
  name: string
}

export interface UpdateSpotDTO {
  name?: string
  active?: boolean
}
