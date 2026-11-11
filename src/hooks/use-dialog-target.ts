import { useState } from "react"

/**
 * Controla um diálogo que atua sobre um item (editar/excluir) ou sem item
 * (cadastrar).
 *
 * - O item é mantido ao fechar, para o conteúdo não "piscar" durante a
 *   animação de saída.
 * - `version` muda a cada `show()`. Use-o como `key` do diálogo de formulário:
 *   assim, reabrir (inclusive para outro item) durante a animação de saída
 *   remonta o formulário em vez de reaproveitar o estado da abertura anterior.
 */
export function useDialogTarget<T>() {
  const [state, setState] = useState<{ open: boolean; item?: T; version: number }>({
    open: false,
    version: 0,
  })

  return {
    open: state.open,
    item: state.item,
    version: state.version,
    show: (item?: T) =>
      setState((current) => ({ open: true, item, version: current.version + 1 })),
    setOpen: (open: boolean) => setState((current) => ({ ...current, open })),
  }
}
