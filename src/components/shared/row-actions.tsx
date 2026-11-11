import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RowActionsProps {
  label: string
  onEdit: () => void
  onDelete: () => void
}

export function RowActions({ label, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Editar ${label}`}
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Excluir ${label}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
