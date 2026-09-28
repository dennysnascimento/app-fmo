import { calcularCaixa, CUSTOS_FIXOS, irregularesDoMes } from "./caixa"
import { Mensalidade } from "../types/mensalidade"

const mes = (extra: Partial<Mensalidade> = {}): Mensalidade => ({
  mes: "09",
  ano: "2025",
  mesFechado: false,
  valor: 120,
  irmaos: ["1001", "1002", "1003"],
  pagos: ["1001", "1003"],
  tronco: 50,
  ...extra,
})

describe("calcularCaixa", () => {
  it("soma as mensalidades pagas e desconta os custos fixos", () => {
    const [caixa] = calcularCaixa([mes()])
    expect(caixa.receitas).toBe(240)
    expect(caixa.custos).toBe(CUSTOS_FIXOS.aluguel + CUSTOS_FIXOS.insumos)
    expect(caixa.saldo).toBe(240 - 580)
    expect(caixa.tronco).toBe(50)
    expect(caixa.totalIrmaos).toBe(3)
  })

  it("usa o valor padrão da mensalidade quando o mês não informa", () => {
    const [caixa] = calcularCaixa([mes({ valor: 0 })])
    expect(caixa.receitas).toBe(240)
  })
})

describe("irregularesDoMes", () => {
  it("deriva dos que não pagaram quando o cadastro não lista", () => {
    expect(irregularesDoMes(mes())).toEqual(["1002"])
  })

  it("respeita a lista explícita do cadastro antigo", () => {
    expect(irregularesDoMes(mes({ iregulares: ["1003"] }))).toEqual(["1003"])
  })
})
