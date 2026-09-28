import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import Logo from "../../components/Logo"

/**
 * Entrada da área interna. Uma palavra-passe só para a Loja e o CIM opcional, que identifica o
 * irmão (nome, grau e, para a gestão, o que ela pode editar). Look próprio, fora do tema
 * claro do app: fundo azul maçônico e dourado, como a fachada do templo.
 */
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [cim, setCim] = useState("")
  const [palavraPasse, setPalavraPasse] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    try {
      await login(cim, palavraPasse)
      const de = (location.state as { de?: string } | null)?.de
      // replace: a tela de entrada não fica no histórico.
      navigate(de && de !== "/login" ? de : "/loja", { replace: true })
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Não foi possível entrar."
      setErro(mensagem)
      toast.error("Entrada recusada", { description: mensagem })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-sidebar-border bg-[hsl(224,45%,19%)] p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="h-20 w-20 rounded-full bg-white/95 p-1" />
          <h1 className="mt-4 text-3xl font-bold tracking-wide text-ouro">Willkommen</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/70">A∴R∴L∴S∴ Flaviano Mendes de Oliveira Nº 43</p>
        </div>

        <form onSubmit={entrar} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="cim" className="text-sidebar-foreground">CIM (opcional)</Label>
            <Input
              id="cim"
              inputMode="numeric"
              autoComplete="username"
              value={cim}
              onChange={(e) => setCim(e.target.value.replace(/\D/g, ""))}
              placeholder="Número de matrícula"
              className="border-sidebar-border bg-sidebar text-white placeholder:text-sidebar-foreground/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="palavra-passe" className="text-sidebar-foreground">Palavra-passe</Label>
            <Input
              id="palavra-passe"
              type="password"
              autoComplete="current-password"
              required
              value={palavraPasse}
              onChange={(e) => setPalavraPasse(e.target.value)}
              className="border-sidebar-border bg-sidebar text-white placeholder:text-sidebar-foreground/40"
            />
          </div>

          {erro && (
            <div role="alert" className="rounded-md border border-error-foreground/40 bg-error/90 px-3 py-2 text-sm text-error-foreground">
              {erro}
            </div>
          )}

          <Button type="submit" size="lg" disabled={carregando} className="w-full bg-ouro text-ouro-foreground hover:bg-ouro/90 text-base font-bold tracking-wide">
            {carregando ? "Conferindo..." : "Wer ist da?"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-sidebar-foreground/50">
          <button type="button" onClick={() => navigate("/")} className="hover:text-white">Voltar à página pública</button>
          <span>&copy; 2017-{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}
