const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export const formatarMoeda = (valor: number) => moeda.format(valor)

export const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })

/** "09/2025" a partir de mes e ano do cadastro. */
export const competencia = (mes: string, ano: string) => `${mes}/${ano}`
