export interface Capitulo {
  id: number
  titulo: string
  /** HTML pronto, vindo do acervo em docs/acervo. */
  conteudo: string
}

export interface Ritual {
  capitulos: Capitulo[]
}
