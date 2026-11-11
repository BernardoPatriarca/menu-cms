import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { ActiveBadge } from "@/components/shared/active-badge"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { RowActions } from "@/components/shared/row-actions"
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/state-views"
import { useToast } from "@/components/shared/toast-context"
import { getErrorMessage } from "@/lib/axios"
import { formatCurrency } from "@/lib/format"
import { useDialogTarget } from "@/hooks/use-dialog-target"
import { useCategories } from "@/cases/categories/hooks/use-categories"
import {
  ProductFormDialog,
  type ProductFormValues,
} from "@/cases/products/components/product-form-dialog"
import { ProductThumb } from "@/cases/products/components/product-thumb"
import type { ProductDTO } from "@/cases/products/dtos/product.dto"
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/cases/products/hooks/use-products"

const ALL = "all"
const NO_CATEGORY = "none"

export function ProductsPage() {
  const { notify } = useToast()
  const products = useProducts()
  const categories = useCategories()

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const form = useDialogTarget<ProductDTO>()
  const removal = useDialogTarget<ProductDTO>()
  const [filter, setFilter] = useState(ALL)

  const saving = form.item ? updateProduct : createProduct

  const filterOptions = [
    { value: ALL, label: "Todas as categorias" },
    ...(categories.data ?? []).map((category) => ({
      value: category.id,
      label: category.name,
    })),
    { value: NO_CATEGORY, label: "Sem categoria" },
  ]

  // Se a categoria filtrada deixar de existir (excluída), volta a mostrar tudo.
  const activeFilter = filterOptions.some((option) => option.value === filter)
    ? filter
    : ALL

  const visibleProducts = (products.data ?? []).filter((product) => {
    if (activeFilter === ALL) return true
    if (activeFilter === NO_CATEGORY) return !product.category
    return product.category?.id === activeFilter
  })

  function openForm(product?: ProductDTO) {
    createProduct.reset()
    updateProduct.reset()
    form.show(product)
  }

  function openRemoval(product: ProductDTO) {
    deleteProduct.reset()
    removal.show(product)
  }

  function handleSave(values: ProductFormValues) {
    const product = form.item

    const onSuccess = () => {
      form.setOpen(false)
      notify(product ? "Produto atualizado." : "Produto cadastrado.")
    }

    if (product) {
      updateProduct.mutate(
        {
          id: product.id,
          dto: {
            name: values.name,
            price: values.price,
            description: values.description || null,
            picture: values.picture || null,
            active: values.active,
            // Só reenvia a categoria se mudou: a API recusa categorias inativas.
            categoryId:
              values.categoryId && values.categoryId !== product.category?.id
                ? values.categoryId
                : undefined,
          },
        },
        { onSuccess },
      )
    } else {
      createProduct.mutate(
        {
          name: values.name,
          price: values.price,
          description: values.description || undefined,
          picture: values.picture || undefined,
          categoryId: values.categoryId ?? undefined,
        },
        { onSuccess },
      )
    }
  }

  function handleDelete() {
    if (!removal.item) return

    deleteProduct.mutate(removal.item.id, {
      onSuccess: () => {
        removal.setOpen(false)
        notify("Produto excluído.")
      },
    })
  }

  function renderContent() {
    if (products.isPending) return <LoadingState label="Carregando produtos..." />

    if (products.isError) {
      return (
        <ErrorState
          message="Não foi possível carregar os produtos."
          onRetry={() => void products.refetch()}
        />
      )
    }

    if (products.data.length === 0) {
      return (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Cadastre o primeiro produto para montar o cardápio."
          action={<Button onClick={() => openForm()}>Novo produto</Button>}
        />
      )
    }

    if (visibleProducts.length === 0) {
      return (
        <EmptyState
          title="Nenhum produto nesta categoria"
          action={
            <Button variant="outline" onClick={() => setFilter(ALL)}>
              Limpar filtro
            </Button>
          }
        />
      )
    }

    return (
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <ProductThumb src={product.picture} alt={product.name} />
                    <div className="min-w-0">
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="max-w-xs truncate text-xs text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.category?.name ?? (
                    <span className="text-muted-foreground">Sem categoria</span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <ActiveBadge active={product.active} />
                </TableCell>
                <TableCell>
                  <RowActions
                    label={product.name}
                    onEdit={() => openForm(product)}
                    onDelete={() => openRemoval(product)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Itens do cardápio digital, com preço, foto e categoria."
        actions={
          <Button onClick={() => openForm()}>
            <Plus /> Novo produto
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span id="filter-label" className="text-sm text-muted-foreground">
          Filtrar por categoria
        </span>
        <Select
          items={filterOptions}
          value={activeFilter}
          onValueChange={(value) => setFilter(value ?? ALL)}
        >
          <SelectTrigger className="w-56" aria-labelledby="filter-label">
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

        {products.data && (
          <span className="text-sm text-muted-foreground">
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1 ? "produto" : "produtos"}
          </span>
        )}
      </div>

      {renderContent()}

      <ProductFormDialog
        key={form.version}
        open={form.open}
        onOpenChange={form.setOpen}
        product={form.item}
        categories={categories.data ?? []}
        isPending={saving.isPending}
        error={
          saving.isError
            ? getErrorMessage(saving.error, "Não foi possível salvar o produto.")
            : undefined
        }
        onSubmit={handleSave}
      />

      <ConfirmDeleteDialog
        open={removal.open}
        onOpenChange={removal.setOpen}
        title="Excluir produto?"
        description={`O produto "${removal.item?.name ?? ""}" será removido do cardápio. Esta ação não pode ser desfeita.`}
        isPending={deleteProduct.isPending}
        error={
          deleteProduct.isError
            ? getErrorMessage(
                deleteProduct.error,
                "Não foi possível excluir. Produtos que já foram pedidos não podem ser removidos — desative o produto.",
              )
            : undefined
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
