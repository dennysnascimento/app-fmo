import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react"
import { Usuario } from "../types/usuario"
import { usuarioService } from "../services/usuarioService"
import { ehGestor } from "../lib/gestao"

const SESSAO_KEY = "fmo_sessao"

interface Sessao {
  usuario: Usuario | null
  cim: string | null
}

interface AuthContextType {
  usuario: Usuario | null
  cim: string | null
  isAuthenticated: boolean
  /** Venerável e Vigilantes: publicam, editam a secretaria e mantêm o cadastro. */
  gestor: boolean
  login: (cim: string, palavraPasse: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const lerSessao = (): Sessao | null => {
  try {
    const salvo = localStorage.getItem(SESSAO_KEY)
    return salvo ? (JSON.parse(salvo) as Sessao) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)

  const login = useCallback(async (cim: string, palavraPasse: string) => {
    // A palavra-passe é uma só para a Loja e vem do ambiente, nunca do código. Sem ela
    // configurada, ninguém entra: é o sinal de que o .env não foi criado.
    const esperada = process.env.REACT_APP_PALAVRA_PASSE
    if (!esperada) throw new Error("Palavra-passe não configurada. Defina REACT_APP_PALAVRA_PASSE no arquivo .env.")
    if (palavraPasse !== esperada) throw new Error("Palavra-passe incorreta.")

    const cimLimpo = cim.trim()
    const usuario = (cimLimpo ? await usuarioService.porCim(cimLimpo) : null) ?? null
    const nova: Sessao = { usuario, cim: cimLimpo || null }
    localStorage.setItem(SESSAO_KEY, JSON.stringify(nova))
    setSessao(nova)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSAO_KEY)
    setSessao(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      usuario: sessao?.usuario ?? null,
      cim: sessao?.cim ?? null,
      isAuthenticated: sessao !== null,
      gestor: ehGestor(sessao?.cim),
      login,
      logout,
    }),
    [sessao, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider")
  return ctx
}
