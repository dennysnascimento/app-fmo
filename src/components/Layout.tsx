import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { BookOpen, Landmark, LogOut, Menu, Newspaper, Users, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import Logo from "./Logo"
import { cn } from "../lib/utils"

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  visible: boolean
}

/**
 * Casca da área interna: sidebar azul maçônico à esquerda, topo com quem está logado e o
 * conteúdo da rota no meio. No celular a sidebar vira gaveta.
 */
export default function Layout() {
  const { usuario, cim, gestor, logout } = useAuth()
  const navigate = useNavigate()
  const [aberta, setAberta] = useState(false)

  const itens: NavItem[] = [
    { label: "Loja", path: "/loja", icon: Newspaper, visible: true },
    { label: "Ritual", path: "/ritual", icon: BookOpen, visible: true },
    { label: "Secretaria", path: "/secretaria", icon: Landmark, visible: true },
    { label: "Irmãos", path: "/irmaos", icon: Users, visible: gestor },
  ]

  const sair = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="fmo-layout">
      {aberta && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setAberta(false)} />}

      <aside className={cn("fmo-sidebar flex flex-col", aberta && "aberta")}>
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <Logo className="h-10 w-10 rounded-full bg-white/90 p-0.5" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">Flaviano Mendes Nº 43</div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/70">Rito Schröder</div>
          </div>
          <button className="ml-auto text-sidebar-foreground/70 hover:text-white md:hidden" onClick={() => setAberta(false)} aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {itens.filter((i) => i.visible).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setAberta(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-white",
                  isActive && "bg-sidebar-accent text-white"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <NavLink to="/" className="block rounded-md px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-white">
            Página pública da Loja
          </NavLink>
        </div>
      </aside>

      <div className="fmo-main">
        <header className="fmo-header flex items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setAberta(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium leading-tight">{usuario?.nome ?? (cim ? `CIM ${cim}` : "Visitante")}</div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                {usuario?.Grau && <span>{usuario.Grau}</span>}
                {gestor && <Badge variant="ouro">Gestão</Badge>}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={sair}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="fmo-content">
          <div className="fmo-page animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
