import { mensalidadeService } from "./mensalidadeService"
import mensalidadesSeed from "../data/mensalidades.json"

describe("mensalidadeService", () => {
  beforeEach(() => localStorage.clear())

  it("começa pela carga inicial do repositório", async () => {
    expect(await mensalidadeService.listar()).toHaveLength(mensalidadesSeed.length)
  })

  it("guarda a edição de um mês e a devolve na próxima leitura", async () => {
    const [primeiro] = await mensalidadeService.listar()
    await mensalidadeService.atualizar({ ...primeiro, tronco: 75 })
    const [relido] = await mensalidadeService.listar()
    expect(relido.tronco).toBe(75)
  })

  it("volta à carga inicial quando o que está gravado não é JSON", async () => {
    localStorage.setItem("fmo_mensalidades", "{corrompido")
    expect(await mensalidadeService.listar()).toHaveLength(mensalidadesSeed.length)
  })
})
