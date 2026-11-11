import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { ORDER_STATUS_LABEL, getNextStatus } from "../order-status"

interface AdvanceButtonProps {
  order: OrderDTO
  onAdvance: (order: OrderDTO, status: OrderStatus) => void
  size?: "xs" | "sm"
}

/** Avança o pedido para a próxima etapa; some quando ele já foi entregue. */
export function AdvanceButton({ order, onAdvance, size = "sm" }: AdvanceButtonProps) {
  const next = getNextStatus(order.status)

  if (!next) return null

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => onAdvance(order, next)}
      aria-label={`Mover pedido para ${ORDER_STATUS_LABEL[next]}`}
    >
      {ORDER_STATUS_LABEL[next]}
      <ArrowRight />
    </Button>
  )
}
