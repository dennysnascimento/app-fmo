import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./contexts/AuthContext"

const renderizar = (rota: string) =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  )

describe("rotas", () => {
  beforeEach(() => localStorage.clear())

  it("abre a tela de entrada em /login", () => {
    renderizar("/login")
    expect(screen.getByRole("button", { name: /wer ist da/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/palavra-passe/i)).toBeInTheDocument()
  })

  it("manda quem não entrou para o login ao abrir a área interna", () => {
    renderizar("/secretaria")
    expect(screen.getByRole("button", { name: /wer ist da/i })).toBeInTheDocument()
  })
})
