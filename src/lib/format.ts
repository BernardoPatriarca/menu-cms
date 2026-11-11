const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

/** O TypeORM devolve colunas `numeric` como string ("12.50"). */
export function formatCurrency(value: number | string): string {
  return currency.format(Number(value))
}

export function formatDateTime(value: string): string {
  return dateTime.format(new Date(value))
}

/** Os ids são UUIDs; para exibição basta o início. */
export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}
