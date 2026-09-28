import { Mensalidade } from "../types/mensalidade"
import mensalidadesSeed from "../data/mensalidades.json"

/**
 * Enquanto a API não tem mensalidades, o cadastro vive no navegador: o JSON do repositório
 * é a carga inicial e o localStorage guarda o que a secretaria editou. Trocar por chamadas
 * à API é só mexer aqui.
 */
const STORAGE_KEY = "fmo_mensalidades"

const ler = (): Mensalidade[] => {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) return JSON.parse(salvo) as Mensalidade[]
  } catch {
    // Conteúdo corrompido: volta à carga inicial.
  }
  return mensalidadesSeed as Mensalidade[]
}

const gravar = (lista: Mensalidade[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))

const mesmaCompetencia = (a: Pick<Mensalidade, "mes" | "ano">, b: Pick<Mensalidade, "mes" | "ano">) =>
  a.mes === b.mes && a.ano === b.ano

export const mensalidadeService = {
  listar: async (): Promise<Mensalidade[]> => ler(),

  atualizar: async (mes: Mensalidade): Promise<Mensalidade[]> => {
    const lista = ler().map((m) => (mesmaCompetencia(m, mes) ? { ...m, ...mes } : m))
    gravar(lista)
    return lista
  },

  adicionar: async (mes: Mensalidade): Promise<Mensalidade[]> => {
    const lista = [...ler(), mes]
    gravar(lista)
    return lista
  },

  remover: async (competencia: Pick<Mensalidade, "mes" | "ano">): Promise<Mensalidade[]> => {
    const lista = ler().filter((m) => !mesmaCompetencia(m, competencia))
    gravar(lista)
    return lista
  },
}
