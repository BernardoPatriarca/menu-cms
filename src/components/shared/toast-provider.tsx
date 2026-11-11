import { useCallback, useMemo, useState, type ReactNode } from "react"
import { CircleAlert, CircleCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToastContext, type ToastKind } from "./toast-context"

interface Toast {
  id: number
  message: string
  kind: ToastKind
}

const DURATION_MS = 4000
let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = nextId++
      setToasts((current) => [...current, { id, message, kind }])
      window.setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-3 text-sm shadow-lg",
              toast.kind === "error" ? "border-destructive/40" : "border-border",
            )}
          >
            {toast.kind === "error" ? (
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            ) : (
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            )}

            <p className="flex-1">{toast.message}</p>

            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => dismiss(toast.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
