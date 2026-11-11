import { cn } from "@/lib/utils"
import type { OrderItemDTO } from "../dtos/order.dto"

export function OrderItemsList({
  items,
  className,
}: {
  items: OrderItemDTO[]
  className?: string
}) {
  return (
    <ul className={cn("space-y-0.5 text-sm", className)}>
      {items.map((item) => (
        <li key={item.id} className="flex gap-1.5">
          <span className="font-medium tabular-nums">{item.quantity}×</span>
          <span>{item.product.name}</span>
        </li>
      ))}
    </ul>
  )
}
