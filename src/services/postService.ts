import { Comentario, Post } from "../types/post"
import postsSeed from "../data/posts.json"

/** Feed da Loja. Mesmo arranjo do mensalidadeService: carga inicial do JSON, edições no navegador. */
const STORAGE_KEY = "fmo_posts"
export const LIMITE_CARACTERES = 600

const ler = (): Post[] => {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) return JSON.parse(salvo) as Post[]
  } catch {
    // Conteúdo corrompido: volta à carga inicial.
  }
  return postsSeed as Post[]
}

const gravar = (lista: Post[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))

export const postService = {
  /** Mais recente primeiro. */
  listar: async (): Promise<Post[]> =>
    [...ler()].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),

  publicar: async (post: Post): Promise<void> => gravar([...ler(), post]),

  comentar: async (data: string, comentario: Comentario): Promise<void> =>
    gravar(ler().map((p) => (p.data === data ? { ...p, comentarios: [...(p.comentarios ?? []), comentario] } : p))),
}
