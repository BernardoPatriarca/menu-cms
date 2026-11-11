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

export interface NamedEntityValues {
  name: string
  active: boolean
}

interface NamedEntityFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Item em edição; sem ele o formulário cadastra um novo. */
  item?: NamedEntityValues
  /** Substantivo feminino, ex.: "categoria", "mesa" (usado em "da {noun}"). */
  noun: string
  namePlaceholder: string
  activeLabel: string
  isPending: boolean
  error?: string
  onSubmit: (values: NamedEntityValues) => void
}

export function NamedEntityFormDialog({
  open,
  onOpenChange,
  item,
  noun,
  namePlaceholder,
  activeLabel,
  isPending,
  error,
  onSubmit,
}: NamedEntityFormDialogProps) {
  const isEditing = item !== undefined

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editar ${noun}` : `Nova ${noun}`}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Altere os dados da ${noun}.`
              : `Informe os dados da nova ${noun}.`}
          </DialogDescription>
        </DialogHeader>

        {/* O conteúdo do diálogo é desmontado ao fechar: o estado reinicia a cada abertura. */}
        <Form
          key={item ? "edit" : "create"}
          item={item}
          noun={noun}
          namePlaceholder={namePlaceholder}
          activeLabel={activeLabel}
          isPending={isPending}
          error={error}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormProps
  extends Pick<
    NamedEntityFormDialogProps,
    "item" | "noun" | "namePlaceholder" | "activeLabel" | "isPending" | "error" | "onSubmit"
  > {
  onCancel: () => void
}

function Form({
  item,
  noun,
  namePlaceholder,
  activeLabel,
  isPending,
  error,
  onCancel,
  onSubmit,
}: FormProps) {
  const [name, setName] = useState(item?.name ?? "")
  const [active, setActive] = useState(item?.active ?? true)
  const [validation, setValidation] = useState("")

  const nameId = useId()
  const activeId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = name.trim()

    if (!trimmed) {
      setValidation(`Informe o nome da ${noun}.`)
      return
    }

    setValidation("")
    onSubmit({ name: trimmed, active })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor={nameId}>Nome</Label>
        <Input
          id={nameId}
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={namePlaceholder}
          maxLength={60}
          disabled={isPending}
          aria-invalid={validation ? true : undefined}
        />
      </div>

      {item && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={activeId}
            checked={active}
            onCheckedChange={(checked) => setActive(checked === true)}
            disabled={isPending}
          />
          <Label htmlFor={activeId}>{activeLabel}</Label>
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
