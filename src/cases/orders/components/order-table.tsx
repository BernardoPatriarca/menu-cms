import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/state-views"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "../order-status"
import { AdvanceButton } from "./advance-button"
import { OrderItemsList } from "./order-items-list"
import { OrderStatusBadge } from "./order-status-badge"

const ALL = "all"

const filterOptions = [
  { value: ALL, label: "Todos os status" },
  ...ORDER_STATUS_FLOW.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABEL[status],
  })),
]

interface OrderTableProps {
  orders: OrderDTO[]
  onAdvance: (order: OrderDTO, status: OrderStatus) => void
}

export function OrderTable({ orders, onAdvance }: OrderTableProps) {
  const [filter, setFilter] = useState(ALL)

  const visible = orders.filter((order) => filter === ALL || order.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span id="order-filter-label" className="text-sm text-muted-foreground">
          Filtrar por status
        </span>
        <Select
          items={filterOptions}
          value={filter}
          onValueChange={(value) => setFilter(value ?? ALL)}
        >
          <SelectTrigger className="w-48" aria-labelledby="order-filter-label">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Nenhum pedido com este status" />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Avançar para</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium tabular-nums">#{shortId(order.id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{order.guestCheck.spot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Comanda {shortId(order.guestCheck.id)}
                      {order.guestCheck.status === "CLOSED" && " (fechada)"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <OrderItemsList items={order.items} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <AdvanceButton order={order} onAdvance={onAdvance} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
