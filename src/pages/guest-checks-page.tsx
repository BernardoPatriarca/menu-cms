import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/state-views"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { useDialogTarget } from "@/hooks/use-dialog-target"
import { GuestCheckOrdersDialog } from "@/cases/guest-checks/components/guest-check-orders-dialog"
import type { GuestCheckDTO } from "@/cases/guest-checks/dtos/guest-check.dto"
import { useOpenedGuestChecks } from "@/cases/guest-checks/hooks/use-guest-checks"
import type { OrderDTO } from "@/cases/orders/dtos/order.dto"
import { useOrders } from "@/cases/orders/hooks/use-orders"

export function GuestChecksPage() {
  const guestChecks = useOpenedGuestChecks()
  const orders = useOrders()
  const details = useDialogTarget<GuestCheckDTO>()

  // Os pedidos vêm da API já vinculados à comanda; agrupamos por comanda.
  const ordersByCheck = new Map<string, OrderDTO[]>()
  for (const order of orders.data ?? []) {
    const list = ordersByCheck.get(order.guestCheck.id) ?? []
    list.push(order)
    ordersByCheck.set(order.guestCheck.id, list)
  }

  const isPending = guestChecks.isPending || orders.isPending
  const isError = guestChecks.isError || orders.isError

  function retry() {
    void guestChecks.refetch()
    void orders.refetch()
  }

  function renderContent() {
    if (isPending) return <LoadingState label="Carregando comandas..." />

    if (isError || !guestChecks.data) {
      return (
        <ErrorState message="Não foi possível carregar as comandas." onRetry={retry} />
      )
    }

    if (guestChecks.data.length === 0) {
      return (
        <EmptyState
          title="Nenhuma comanda em aberto"
          description="Quando um cliente fizer o primeiro pedido de uma mesa, a comanda aparece aqui."
        />
      )
    }

    return (
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mesa</TableHead>
              <TableHead>Comanda</TableHead>
              <TableHead>Aberta em</TableHead>
              <TableHead className="text-right">Pedidos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestChecks.data.map((guestCheck) => {
              const checkOrders = ordersByCheck.get(guestCheck.id) ?? []
              const total = checkOrders.reduce((sum, order) => sum + Number(order.total), 0)

              return (
                <TableRow key={guestCheck.id}>
                  <TableCell className="font-medium">{guestCheck.spot.name}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    #{shortId(guestCheck.id)}
                  </TableCell>
                  <TableCell>{formatDateTime(guestCheck.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {checkOrders.length}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => details.show(guestCheck)}>
                      Ver pedidos
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Comandas"
        description="Comandas em aberto no salão, com os pedidos e o total consumido em cada uma."
      />

      {renderContent()}

      <GuestCheckOrdersDialog
        open={details.open}
        onOpenChange={details.setOpen}
        guestCheck={details.item}
        orders={details.item ? (ordersByCheck.get(details.item.id) ?? []) : []}
      />
    </>
  )
}
