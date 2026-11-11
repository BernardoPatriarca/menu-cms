import { createContext, useContext } from "react"

export type ToastKind = "success" | "error"

export interface ToastContextValue {
  notify: (message: string, kind?: ToastKind) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>.")
  }

  return context
}
