import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Extrai uma mensagem legível de um erro do Axios. A API NestJS devolve
 * `message` como string ou como lista (class-validator).
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Sem conexão com a API. Verifique se o servidor está no ar."
    }

    const message = error.response.data?.message

    if (Array.isArray(message) && message.length > 0) return message.join(" ")
    if (typeof message === "string" && error.response.status < 500) return message
  }

  return fallback
}
