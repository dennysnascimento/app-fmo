import { ehGestor } from "./gestao"

describe("ehGestor", () => {
  it("reconhece os CIMs da gestão em string ou número", () => {
    expect(ehGestor("1001")).toBe(true)
    expect(ehGestor(1002)).toBe(true)
  })

  it("recusa quem não é da gestão e quem não tem CIM", () => {
    expect(ehGestor("10577")).toBe(false)
    expect(ehGestor(null)).toBe(false)
    expect(ehGestor(undefined)).toBe(false)
  })
})
