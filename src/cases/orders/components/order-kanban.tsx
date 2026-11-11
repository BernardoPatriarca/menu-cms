import { useState, type DragEvent } from "react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  getNextStatus,
} from "../order-status"
import { AdvanceButton } from "./advance-button"
import { OrderItemsList } from "./order-items-list"

interface OrderKanbanProps {
  orders: OrderDTO[]
  /** Chamado ao soltar um cartão em outra coluna ou ao usar o botão "avançar". */
  onMove: (order: OrderDTO, status: OrderStatus) => void
}

export function OrderKanban({ orders, onMove }: OrderKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [hoverColumn, setHoverColumn] = useState<OrderStatus | null>(null)

  const dragging = orders.find((order) => order.id === draggingId)
  const validTarget = dragging ? getNextStatus(dragging.status) : undefined

  function endDrag() {
    setDraggingId(null)
    setHoverColumn(null)
  }

  function handleDrop(event: DragEvent<HTMLElement>, status: OrderStatus) {
    event.preventDefault()

    if (dragging && dragging.status !== status) onMove(dragging, status)

    endDrag()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {ORDER_STATUS_FLOW.map((status) => {
        const column = orders.filter((order) => order.status === status)
        const isValidTarget = validTarget === status

        return (
          <section
            key={status}
            aria-label={`Coluna ${ORDER_STATUS_LABEL[status]}`}
            onDragOver={(event) => {
              if (!dragging) return
              event.preventDefault()
              setHoverColumn(status)
            }}
            onDragLeave={() => setHoverColumn((current) => (current === status ? null : current))}
            onDrop={(event) => handleDrop(event, status)}
            className={cn(
              "flex flex-col rounded-xl border bg-muted/40 transition-colors",
              isValidTarget && "border-primary/60 border-dashed bg-primary/5",
              isValidTarget && hoverColumn === status && "bg-primary/15",
            )}
          >
            <header className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  ORDER_STATUS_TONE[status],
                )}
              >
                {ORDER_STATUS_LABEL[status]}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {column.length}
              </span>
            </header>

            <ul className="flex max-h-[65vh] min-h-32 flex-col gap-2 overflow-y-auto p-2">
              {column.length === 0 && (
                <li className="py-6 text-center text-xs text-muted-foreground">
                  {isValidTarget ? "Solte aqui" : "Nenhum pedido"}
                </li>
              )}

              {column.map((order) => {
                const movable = getNextStatus(order.status) !== undefined

                return (
                  <li
                    key={order.id}
                    draggable={movable}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move"
                      event.dataTransfer.setData("text/plain", order.id)
                      setDraggingId(order.id)
                    }}
                    onDragEnd={endDrag}
                    className={cn(
                      "space-y-2 rounded-lg border bg-card p-3 shadow-xs",
                      movable && "cursor-grab active:cursor-grabbing",
                      draggingId === order.id && "opacity-40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{order.guestCheck.spot.name}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          #{shortId(order.id)} · {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm font-medium tabular-nums">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <OrderItemsList items={order.items} />

                    {movable && (
                      <div className="flex justify-end pt-1">
                        <AdvanceButton order={order} onAdvance={onMove} size="xs" />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
