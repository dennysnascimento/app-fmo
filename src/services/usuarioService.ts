import api from "./api"
import { Usuario, UsuarioForm } from "../types/usuario"
import usuariosSeed from "../data/usuarios.json"

export const usuarioService = {
  listar: async (): Promise<Usuario[]> => (await api.get<Usuario[]>("/users")).data,
  buscar: async (id: Usuario["id"]): Promise<Usuario> => (await api.get<Usuario>(`/users/${id}`)).data,
  criar: async (dados: UsuarioForm): Promise<Usuario> => (await api.post<Usuario>("/users", dados)).data,
  atualizar: async (id: Usuario["id"], dados: Partial<UsuarioForm>): Promise<Usuario> =>
    (await api.put<Usuario>(`/users/${id}`, dados)).data,
  excluir: async (id: Usuario["id"]): Promise<void> => {
    await api.delete(`/users/${id}`)
  },

  /**
   * Acha o irmão pelo CIM para a entrada e para o recibo. Tenta a API e, com ela fora do ar,
   * cai no cadastro local: a Loja não pode ficar sem entrar porque o backend não subiu.
   */
  porCim: async (cim: string): Promise<Usuario | null> => {
    let lista: Usuario[] = usuariosSeed as Usuario[]
    try {
      lista = await usuarioService.listar()
    } catch {
      // API indisponível: segue com o cadastro local.
    }
    return lista.find((u) => u.CIM && String(u.CIM) === String(cim)) ?? null
  },
}
