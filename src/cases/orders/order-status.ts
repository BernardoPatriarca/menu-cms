import type { OrderStatus } from "./dtos/order.dto"

/** Ordem do fluxo de preparo: é também a ordem das colunas do Kanban. */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "NEW",
  "PREPARING",
  "READY",
  "DELIVERY",
]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "Novo",
  PREPARING: "Em preparo",
  READY: "Pronto",
  DELIVERY: "Entregue",
}

/** Classes de cor (badge/coluna) para cada status. */
export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  NEW: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  PREPARING: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  READY: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  DELIVERY: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
}

/**
 * A API só aceita avançar um passo por vez (NEW → PREPARING → READY →
 * DELIVERY). Devolve o próximo status, ou undefined se já foi entregue.
 */
export function getNextStatus(status: OrderStatus): OrderStatus | undefined {
  return ORDER_STATUS_FLOW[ORDER_STATUS_FLOW.indexOf(status) + 1]
}
