export type StatusIrmao = "regular" | "irregular" | "adormecido"

/** Um mês de mensalidades. CIMs em string porque é assim que os cadastros e a API os tratam. */
export interface Mensalidade {
  mes: string
  ano: string
  mesFechado: boolean
  valor: number
  irmaos: string[]
  pagos: string[]
  iregulares?: string[]
  statusUsuarios?: Record<string, StatusIrmao>
  tronco: number
}
