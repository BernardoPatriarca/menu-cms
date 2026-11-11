import { useState } from "react"
import { Columns3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/state-views"
import { useToast } from "@/components/shared/toast-context"
import { getErrorMessage } from "@/lib/axios"
import { shortId } from "@/lib/format"
import { OrderKanban } from "@/cases/orders/components/order-kanban"
import { OrderTable } from "@/cases/orders/components/order-table"
import type { OrderDTO, OrderStatus } from "@/cases/orders/dtos/order.dto"
import { useOrders, useUpdateOrderStatus } from "@/cases/orders/hooks/use-orders"
import {
  ORDER_STATUS_LABEL,
  getNextStatus,
} from "@/cases/orders/order-status"

type View = "kanban" | "list"

export function OrdersPage() {
  const { notify } = useToast()
  const { data: orders, isPending, isError, refetch } = useOrders()
  const updateStatus = useUpdateOrderStatus()
  const [view, setView] = useState<View>("kanban")

  function handleMove(order: OrderDTO, status: OrderStatus) {
    // A API só aceita avançar uma etapa por vez; explicamos em vez de deixar falhar.
    if (status !== getNextStatus(order.status)) {
      notify(
        "Um pedido só pode avançar uma etapa por vez: Novo → Em preparo → Pronto → Entregue.",
        "error",
      )
      return
    }

    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          notify(`Pedido #${shortId(order.id)} agora está "${ORDER_STATUS_LABEL[status]}".`),
        onError: (error) =>
          notify(
            getErrorMessage(error, "Não foi possível alterar o status do pedido."),
            "error",
          ),
      },
    )
  }

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Acompanhe os pedidos das comandas e avance cada um pelas etapas do preparo."
        actions={
          <div
            role="group"
            aria-label="Modo de visualização"
            className="flex rounded-lg border bg-card p-0.5"
          >
            <Button
              variant={view === "kanban" ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={view === "kanban"}
              onClick={() => setView("kanban")}
            >
              <Columns3 /> Kanban
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List /> Lista
            </Button>
          </div>
        }
      />

      {isPending ? (
        <LoadingState label="Carregando pedidos..." />
      ) : isError ? (
        <ErrorState
          message="Não foi possível carregar os pedidos."
          onRetry={() => void refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Nenhum pedido ainda"
          description="Os pedidos feitos pelos clientes no cardápio digital aparecem aqui."
        />
      ) : view === "kanban" ? (
        <OrderKanban orders={orders} onMove={handleMove} />
      ) : (
        <OrderTable orders={orders} onAdvance={handleMove} />
      )}
    </>
  )
}
