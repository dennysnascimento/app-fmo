export interface Comentario {
  autor: string
  data: string
  texto: string
}

export interface Post {
  autor: string
  conteudo: string
  data: string
  cim?: string
  comentarios?: Comentario[]
}
