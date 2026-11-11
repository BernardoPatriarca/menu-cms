import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { OrderItemsList } from "@/cases/orders/components/order-items-list"
import { OrderStatusBadge } from "@/cases/orders/components/order-status-badge"
import type { OrderDTO } from "@/cases/orders/dtos/order.dto"
import type { GuestCheckDTO } from "../dtos/guest-check.dto"

interface GuestCheckOrdersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guestCheck?: GuestCheckDTO
  orders: OrderDTO[]
}

export function GuestCheckOrdersDialog({
  open,
  onOpenChange,
  guestCheck,
  orders,
}: GuestCheckOrdersDialogProps) {
  const total = orders.reduce((sum, order) => sum + Number(order.total), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {guestCheck?.spot.name} · Comanda {guestCheck && shortId(guestCheck.id)}
          </DialogTitle>
          <DialogDescription>
            {guestCheck && `Aberta em ${formatDateTime(guestCheck.createdAt)}.`}
          </DialogDescription>
        </DialogHeader>

        {orders.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Esta comanda ainda não tem pedidos.
          </p>
        ) : (
          <ul className="max-h-[50vh] space-y-3 overflow-y-auto">
            {orders.map((order) => (
              <li key={order.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium tabular-nums">
                    #{shortId(order.id)}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {formatDateTime(order.createdAt)}
                    </span>
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <OrderItemsList items={order.items} />
                <p className="text-right text-sm font-medium tabular-nums">
                  {formatCurrency(order.total)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter className="items-center sm:justify-between">
          <p className="text-sm">
            Total da comanda:{" "}
            <strong className="tabular-nums">{formatCurrency(total)}</strong>
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
