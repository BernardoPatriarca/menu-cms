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
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/cases/categories/hooks/use-categories"

export function CategoriesPage() {
  const { notify } = useToast()
  const { data: categories, isPending, isError, refetch } = useCategories()

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const form = useDialogTarget<CategoryDTO>()
  const removal = useDialogTarget<CategoryDTO>()

  const saving = form.item ? updateCategory : createCategory

  function openForm(category?: CategoryDTO) {
    createCategory.reset()
    updateCategory.reset()
    form.show(category)
  }

  function openRemoval(category: CategoryDTO) {
    deleteCategory.reset()
    removal.show(category)
  }

  function handleSave(values: { name: string; active: boolean }) {
    const category = form.item

    const onSuccess = () => {
      form.setOpen(false)
      notify(category ? "Categoria atualizada." : "Categoria cadastrada.")
    }

    if (category) {
      updateCategory.mutate({ id: category.id, dto: values }, { onSuccess })
    } else {
      createCategory.mutate({ name: values.name }, { onSuccess })
    }
  }

  function handleDelete() {
    if (!removal.item) return

    deleteCategory.mutate(removal.item.id, {
      onSuccess: () => {
        removal.setOpen(false)
        notify("Categoria excluída.")
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize o cardápio em grupos, como Bebidas e Sobremesas."
        actions={
          <Button onClick={() => openForm()}>
            <Plus /> Nova categoria
          </Button>
        }
      />

      {isPending ? (
        <LoadingState label="Carregando categorias..." />
      ) : isError ? (
        <ErrorState
          message="Não foi possível carregar as categorias."
          onRetry={() => void refetch()}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria cadastrada"
          description="Cadastre a primeira categoria para começar a montar o cardápio."
          action={<Button onClick={() => openForm()}>Nova categoria</Button>}
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <ActiveBadge active={category.active} />
                  </TableCell>
                  <TableCell>
                    <RowActions
                      label={category.name}
                      onEdit={() => openForm(category)}
                      onDelete={() => openRemoval(category)}
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
        noun="categoria"
        namePlaceholder="Ex.: Bebidas"
        activeLabel="Categoria ativa"
        isPending={saving.isPending}
        error={
          saving.isError
            ? getErrorMessage(saving.error, "Não foi possível salvar a categoria.")
            : undefined
        }
        onSubmit={handleSave}
      />

      <ConfirmDeleteDialog
        open={removal.open}
        onOpenChange={removal.setOpen}
        title="Excluir categoria?"
        description={`A categoria "${removal.item?.name ?? ""}" será removida. Esta ação não pode ser desfeita.`}
        isPending={deleteCategory.isPending}
        error={
          deleteCategory.isError
            ? getErrorMessage(
                deleteCategory.error,
                "Não foi possível excluir. Se houver produtos nesta categoria, mova-os para outra antes — ou apenas desative a categoria.",
              )
            : undefined
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
