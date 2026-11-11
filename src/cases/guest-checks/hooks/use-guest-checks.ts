import { useQuery } from "@tanstack/react-query"
import { GuestCheckService } from "../services/guest-check.service"

export const openedGuestChecksKey = ["guest-checks", "opened"] as const

/** Comandas em aberto; atualiza sozinha para acompanhar o salão. */
export function useOpenedGuestChecks() {
  return useQuery({
    queryKey: openedGuestChecksKey,
    queryFn: () => GuestCheckService.list("OPENED"),
    refetchInterval: 15_000,
  })
}
