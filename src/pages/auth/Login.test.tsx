import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Login from "./Login"
import { AuthProvider } from "../../contexts/AuthContext"

import { usuarioService } from "../../services/usuarioService"

// O CRA zera as implementações de mock antes de cada teste (resetMocks): a implementação
// entra no beforeEach, não na fábrica do jest.mock.
jest.mock("../../services/usuarioService", () => ({ usuarioService: { porCim: jest.fn() } }))

// O user-event 13 não espera as atualizações assíncronas do envio: sem o act, o React avisa
// sobre estado atualizado fora dele a cada teste.
const enviar = () => act(async () => { await userEvent.click(screen.getByRole("button", { name: /wer ist da/i })) })

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/loja" element={<div>Feed da Loja</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )

describe("Login", () => {
  const ambiente = process.env

  beforeEach(() => {
    localStorage.clear()
    process.env = { ...ambiente, REACT_APP_PALAVRA_PASSE: "segredo" }
    ;(usuarioService.porCim as jest.Mock).mockImplementation(async (cim: string) =>
      cim === "1001" ? { nome: "Anderson", CIM: "1001", Grau: "Mestre" } : null
    )
  })

  afterAll(() => {
    process.env = ambiente
  })

  it("recusa a palavra-passe errada e diz o motivo", async () => {
    renderizar()
    await userEvent.type(screen.getByLabelText(/palavra-passe/i), "errada")
    await enviar()
    expect(await screen.findByRole("alert")).toHaveTextContent("Palavra-passe incorreta.")
  })

  it("entra com a palavra-passe certa e identifica o irmão pelo CIM", async () => {
    renderizar()
    await userEvent.type(screen.getByLabelText(/cim/i), "1001")
    await userEvent.type(screen.getByLabelText(/palavra-passe/i), "segredo")
    await enviar()
    await waitFor(() => expect(screen.getByText("Feed da Loja")).toBeInTheDocument())
    const sessao = JSON.parse(localStorage.getItem("fmo_sessao") ?? "{}")
    expect(sessao.usuario.nome).toBe("Anderson")
  })

  it("avisa quando a palavra-passe não foi configurada no ambiente", async () => {
    delete process.env.REACT_APP_PALAVRA_PASSE
    renderizar()
    await userEvent.type(screen.getByLabelText(/palavra-passe/i), "qualquer")
    await enviar()
    expect(await screen.findByRole("alert")).toHaveTextContent("REACT_APP_PALAVRA_PASSE")
  })
})
