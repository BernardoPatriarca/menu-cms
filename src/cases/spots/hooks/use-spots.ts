import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SpotService } from "../services/spot.service"
import type { UpdateSpotDTO } from "../dtos/spot.dto"

export const spotsKey = ["spots"] as const

export function useSpots() {
  return useQuery({
    queryKey: spotsKey,
    queryFn: SpotService.list,
  })
}

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SpotService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: spotsKey }),
  })
}

export function useUpdateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSpotDTO }) =>
      SpotService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: spotsKey }),
  })
}

export function useDeleteSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SpotService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: spotsKey }),
  })
}
