import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/auth/Login"

/**
 * Só o Login entra no bundle inicial. A página pública carrega treze fotos e um vídeo, e o
 * Ritual traz 140 KB de texto: ninguém precisa baixar isso para entrar na Secretaria.
 */
const Inicio = lazy(() => import("./pages/publico/Inicio"))
const Feed = lazy(() => import("./pages/loja/Feed"))
const Ritual = lazy(() => import("./pages/ritual/Ritual"))
const Secretaria = lazy(() => import("./pages/secretaria/Secretaria"))
const Recibo = lazy(() => import("./pages/secretaria/Recibo"))
const Irmaos = lazy(() => import("./pages/usuarios/Irmaos"))

const Carregando = () => (
  <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Carregando...</div>
)

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/ritual" element={<Ritual />} />
            <Route element={<Layout />}>
              <Route path="/loja" element={<Feed />} />
              <Route path="/secretaria" element={<Secretaria />} />
              <Route path="/recibo" element={<Recibo />} />
            </Route>
            <Route element={<ProtectedRoute somenteGestor />}>
              <Route element={<Layout />}>
                <Route path="/irmaos" element={<Irmaos />} />
              </Route>
            </Route>
          </Route>

          <Route path="/usuarios" element={<Navigate to="/irmaos" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
