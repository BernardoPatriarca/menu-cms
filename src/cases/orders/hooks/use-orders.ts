import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { OrderService } from "../services/order.service"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"

export const ordersKey = ["orders"] as const

/** Pedidos de todas as comandas; atualiza sozinho para acompanhar a cozinha. */
export function useOrders() {
  return useQuery({
    queryKey: ordersKey,
    queryFn: OrderService.list,
    refetchInterval: 15_000,
  })
}

/**
 * Altera o status de um pedido. A tela muda na hora (update otimista) e volta
 * ao estado anterior se a API recusar a mudança.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ordersKey })
      const previous = queryClient.getQueryData<OrderDTO[]>(ordersKey)

      queryClient.setQueryData<OrderDTO[]>(ordersKey, (orders) =>
        orders?.map((order) => (order.id === id ? { ...order, status } : order)),
      )

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ordersKey, context.previous)
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ordersKey }),
  })
}
