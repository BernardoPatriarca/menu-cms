import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ActiveBadge } from "@/components/shared/active-badge"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { NamedEntityFormDialog } from "@/components/shared/named-entity-form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { RowActions } from "@/components/shared/row-actions"
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/state-views"
import { useToast } from "@/components/shared/toast-context"
import { getErrorMessage } from "@/lib/axios"
import { useDialogTarget } from "@/hooks/use-dialog-target"
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"
import {
  useCreateSpot,
  useDeleteSpot,
  useSpots,
  useUpdateSpot,
} from "@/cases/spots/hooks/use-spots"

export function SpotsPage() {
  const { notify } = useToast()
  const { data: spots, isPending, isError, refetch } = useSpots()

  const createSpot = useCreateSpot()
  const updateSpot = useUpdateSpot()
  const deleteSpot = useDeleteSpot()

  const form = useDialogTarget<SpotDTO>()
  const removal = useDialogTarget<SpotDTO>()

  const saving = form.item ? updateSpot : createSpot

  function openForm(spot?: SpotDTO) {
    createSpot.reset()
    updateSpot.reset()
    form.show(spot)
  }

  function openRemoval(spot: SpotDTO) {
    deleteSpot.reset()
    removal.show(spot)
  }

  function handleSave(values: { name: string; active: boolean }) {
    const spot = form.item

    const onSuccess = () => {
      form.setOpen(false)
      notify(spot ? "Mesa atualizada." : "Mesa cadastrada.")
    }

    if (spot) {
      updateSpot.mutate({ id: spot.id, dto: values }, { onSuccess })
    } else {
      createSpot.mutate({ name: values.name }, { onSuccess })
    }
  }

  function handleDelete() {
    if (!removal.item) return

    deleteSpot.mutate(removal.item.id, {
      onSuccess: () => {
        removal.setOpen(false)
        notify("Mesa excluída.")
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Mesas"
        description="Pontos de atendimento do salão. Cada mesa pode ter uma comanda aberta."
        actions={
          <Button onClick={() => openForm()}>
            <Plus /> Nova mesa
          </Button>
        }
      />

      {isPending ? (
        <LoadingState label="Carregando mesas..." />
      ) : isError ? (
        <ErrorState
          message="Não foi possível carregar as mesas."
          onRetry={() => void refetch()}
        />
      ) : spots.length === 0 ? (
        <EmptyState
          title="Nenhuma mesa cadastrada"
          description="Cadastre as mesas do restaurante para que os clientes possam fazer pedidos."
          action={<Button onClick={() => openForm()}>Nova mesa</Button>}
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="font-medium">{spot.name}</TableCell>
                  <TableCell>
                    <ActiveBadge active={spot.active} />
                  </TableCell>
                  <TableCell>
                    <RowActions
                      label={spot.name}
                      onEdit={() => openForm(spot)}
                      onDelete={() => openRemoval(spot)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NamedEntityFormDialog
        key={form.version}
        open={form.open}
        onOpenChange={form.setOpen}
        item={form.item}
        noun="mesa"
        namePlaceholder="Ex.: Mesa 01"
        activeLabel="Mesa ativa"
        isPending={saving.isPending}
        error={
          saving.isError
            ? getErrorMessage(saving.error, "Não foi possível salvar a mesa.")
            : undefined
        }
        onSubmit={handleSave}
      />

      <ConfirmDeleteDialog
        open={removal.open}
        onOpenChange={removal.setOpen}
        title="Excluir mesa?"
        description={`A mesa "${removal.item?.name ?? ""}" será removida. Esta ação não pode ser desfeita.`}
        isPending={deleteSpot.isPending}
        error={
          deleteSpot.isError
            ? getErrorMessage(
                deleteSpot.error,
                "Não foi possível excluir. Mesas que já tiveram comandas não podem ser removidas — desative a mesa.",
              )
            : undefined
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
