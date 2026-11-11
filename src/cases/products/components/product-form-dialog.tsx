import { useId, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"
import type { ProductDTO } from "../dtos/product.dto"
import { ProductThumb } from "./product-thumb"

export interface ProductFormValues {
  name: string
  price: number
  description: string
  categoryId: string | null
  picture: string
  active: boolean
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Produto em edição; sem ele o formulário cadastra um novo. */
  product?: ProductDTO
  categories: CategoryDTO[]
  isPending: boolean
  error?: string
  onSubmit: (values: ProductFormValues) => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  isPending,
  error,
  onSubmit,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Altere os dados do produto do cardápio."
              : "Informe os dados do novo produto do cardápio."}
          </DialogDescription>
        </DialogHeader>

        {/* O conteúdo do diálogo é desmontado ao fechar: o estado reinicia a cada abertura. */}
        <Form
          product={product}
          categories={categories}
          isPending={isPending}
          error={error}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

/** "12,50" ou "12.5" → 12.5; undefined se inválido (negativo, texto, >2 casas). */
function parsePrice(raw: string): number | undefined {
  const normalized = raw.trim().replace(",", ".")

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return undefined

  return Number(normalized)
}

function isHttpUrl(raw: string): boolean {
  try {
    const { protocol } = new URL(raw)
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}

interface FormProps
  extends Pick<
    ProductFormDialogProps,
    "product" | "categories" | "isPending" | "error" | "onSubmit"
  > {
  onCancel: () => void
}

function Form({
  product,
  categories,
  isPending,
  error,
  onCancel,
  onSubmit,
}: FormProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [price, setPrice] = useState(
    product ? String(Number(product.price)).replace(".", ",") : "",
  )
  const [description, setDescription] = useState(product?.description ?? "")
  const [categoryId, setCategoryId] = useState<string | null>(
    product?.category?.id ?? null,
  )
  const [picture, setPicture] = useState(product?.picture ?? "")
  const [active, setActive] = useState(product?.active ?? true)
  const [validation, setValidation] = useState("")

  const pictureUrl = picture.trim()

  const nameId = useId()
  const priceId = useId()
  const categoryLabelId = useId()
  const descriptionId = useId()
  const pictureId = useId()
  const activeId = useId()

  // Só categorias ativas aceitam novos produtos; a atual entra mesmo se estiver inativa.
  const options = categories
    .filter((category) => category.active || category.id === product?.category?.id)
    .map((category) => ({
      value: category.id,
      label: category.active ? category.name : `${category.name} (inativa)`,
    }))

  // Um produto que já tem categoria não pode ficar sem (a API não permite remover).
  const categoryRequired = !product || Boolean(product.category)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedPrice = parsePrice(price)

    if (!name.trim()) return setValidation("Informe o nome do produto.")
    if (parsedPrice === undefined) {
      return setValidation("Informe um preço válido, por exemplo 12,50.")
    }
    if (categoryRequired && !categoryId) return setValidation("Escolha uma categoria.")
    if (pictureUrl && !isHttpUrl(pictureUrl)) {
      return setValidation("A imagem deve ser um link completo, começando com http:// ou https://.")
    }

    setValidation("")
    onSubmit({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      categoryId,
      picture: pictureUrl,
      active,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <div className="space-y-2">
          <Label htmlFor={nameId}>Nome</Label>
          <Input
            id={nameId}
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: X-Burger"
            maxLength={60}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={priceId}>Preço (R$)</Label>
          <Input
            id={priceId}
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0,00"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label id={categoryLabelId}>Categoria</Label>
        <Select
          items={options}
          value={categoryId}
          onValueChange={setCategoryId}
          disabled={isPending}
        >
          <SelectTrigger className="w-full" aria-labelledby={categoryLabelId}>
            <SelectValue
              placeholder={
                options.length === 0
                  ? "Cadastre uma categoria ativa antes"
                  : "Selecione uma categoria"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={descriptionId}>Descrição</Label>
        <Textarea
          id={descriptionId}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ingredientes, tamanho da porção..."
          rows={3}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={pictureId}>Link da imagem (opcional)</Label>
        <div className="flex items-center gap-3">
          <ProductThumb src={pictureUrl} alt="Pré-visualização" />
          <Input
            id={pictureId}
            type="url"
            value={picture}
            onChange={(event) => setPicture(event.target.value)}
            placeholder="https://..."
            disabled={isPending}
          />
        </div>
      </div>

      {product && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={activeId}
            checked={active}
            onCheckedChange={(checked) => setActive(checked === true)}
            disabled={isPending}
          />
          <Label htmlFor={activeId}>Produto ativo (visível no cardápio)</Label>
        </div>
      )}

      {(validation || error) && (
        <p role="alert" className="text-sm text-destructive">
          {validation || error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
