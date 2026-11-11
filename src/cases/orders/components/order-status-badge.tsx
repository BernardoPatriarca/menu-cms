import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "../dtos/order.dto"
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "../order-status"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("border-transparent", ORDER_STATUS_TONE[status])}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  )
}
