import { Mensalidade } from "../types/mensalidade"

/** Custos fixos do mês, em reais. */
export const CUSTOS_FIXOS = {
  aluguel: 400,
  /** Café, velas e incensos. */
  insumos: 180,
}

export const VALOR_MENSALIDADE = 120

export interface CaixaDoMes {
  mes: string
  ano: string
  receitas: number
  custos: number
  saldo: number
  tronco: number
  pagos: string[]
  irregulares: string[]
  totalIrmaos: number
}

/** Quem está no mês e não pagou. O campo "iregulares" do cadastro antigo tem prioridade quando existe. */
export const irregularesDoMes = (mes: Mensalidade): string[] =>
  mes.iregulares ?? mes.irmaos.filter((cim) => !mes.pagos.includes(cim))

/** Saldo de caixa de cada mês: mensalidades recebidas menos os custos fixos. */
export function calcularCaixa(mensalidades: Mensalidade[]): CaixaDoMes[] {
  const custos = CUSTOS_FIXOS.aluguel + CUSTOS_FIXOS.insumos
  return mensalidades.map((mes) => {
    const receitas = mes.pagos.length * (mes.valor || VALOR_MENSALIDADE)
    return {
      mes: mes.mes,
      ano: mes.ano,
      receitas,
      custos,
      saldo: receitas - custos,
      tronco: mes.tronco ?? 0,
      pagos: mes.pagos,
      irregulares: irregularesDoMes(mes),
      totalIrmaos: mes.irmaos.length,
    }
  })
}
