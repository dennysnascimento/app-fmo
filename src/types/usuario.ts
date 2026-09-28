export type Grau = "Aprendiz" | "Companheiro" | "Mestre"

/** Irmão da Loja. As chaves CIM e Grau ficam em maiúscula porque é assim que a API os devolve. */
export interface Usuario {
  id?: number | string
  nome: string
  CIM: string
  Grau: Grau | string
  celular?: string
  "Data de Nascimento"?: string
}

export interface UsuarioForm {
  nome: string
  CIM: string
  Grau: Grau | ""
  celular: string
  senha: string
}

export const GRAUS: Grau[] = ["Aprendiz", "Companheiro", "Mestre"]
