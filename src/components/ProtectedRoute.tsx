import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Props {
  /** Só a gestão passa. Quem não é gestor volta para o feed. */
  somenteGestor?: boolean
}

export default function ProtectedRoute({ somenteGestor = false }: Props) {
  const { isAuthenticated, gestor } = useAuth()
  const location = useLocation()

  // Guarda para onde a pessoa queria ir: depois de entrar, volta para lá em vez de cair no feed.
  if (!isAuthenticated) return <Navigate to="/login" state={{ de: location.pathname }} replace />
  if (somenteGestor && !gestor) return <Navigate to="/loja" replace />

  return <Outlet />
}
