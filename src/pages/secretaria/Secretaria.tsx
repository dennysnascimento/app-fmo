import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Pencil, Receipt } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../contexts/AuthContext"
import { mensalidadeService } from "../../services/mensalidadeService"
import { usuarioService } from "../../services/usuarioService"
import { Mensalidade, StatusIrmao } from "../../types/mensalidade"
import { calcularCaixa } from "../../lib/caixa"
import { competencia, formatarMoeda } from "../../lib/formato"
import TituloPagina from "../../components/TituloPagina"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { cn } from "../../lib/utils"

const COR_PAGO = "hsl(218, 48%, 35%)"
const COR_IRREGULAR = "hsl(38, 92%, 54%)"
const COR_TRONCO = "hsl(46, 65%, 52%)"

const VARIANTE_STATUS: Record<StatusIrmao, "success" | "warning" | "destructive"> = {
  regular: "success",
  irregular: "warning",
  adormecido: "destructive",
}

export default function Secretaria() {
  const navigate = useNavigate()
  const { cim, gestor } = useAuth()
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])
  const [anoFiltro, setAnoFiltro] = useState("")
  const [mesFiltro, setMesFiltro] = useState("")
  const [editando, setEditando] = useState<Mensalidade | null>(null)
  const [reciboPara, setReciboPara] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const lista = await mensalidadeService.listar()
    setMensalidades(lista)
    setAnoFiltro((atual) => atual || lista[lista.length - 1]?.ano || "")
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const caixa = useMemo(() => calcularCaixa(mensalidades), [mensalidades])
  const anos = useMemo(() => Array.from(new Set(mensalidades.map((m) => m.ano))), [mensalidades])
  const mesesDoAno = caixa.filter((m) => m.ano === anoFiltro)
  const balancete = mesesDoAno.filter((m) => !mesFiltro || m.mes === mesFiltro)
  const ultimo = caixa[caixa.length - 1]

  const dadosBarras = caixa.map((m) => ({ nome: competencia(m.mes, m.ano), Saldo: m.saldo, Tronco: m.tronco }))
  const dadosPizza = ultimo
    ? [
        { nome: "Pagos", valor: ultimo.pagos.length },
        { nome: "Irregulares", valor: ultimo.irregulares.length },
      ]
    : []

  const alternarPagamento = (cimIrmao: string, pago: boolean) => {
    setEditando((atual) => {
      if (!atual) return atual
      const pagos = pago ? [...atual.pagos, cimIrmao] : atual.pagos.filter((c) => c !== cimIrmao)
      return { ...atual, pagos }
    })
    setReciboPara(pago ? cimIrmao : null)
  }

  const salvar = async () => {
    if (!editando) return
    // O gestor que edita não fica irregular no próprio mês.
    let pagos = editando.pagos
    const status = { ...(editando.statusUsuarios ?? {}) }
    if (cim && editando.irmaos.includes(cim)) {
      if (!pagos.includes(cim)) pagos = [...pagos, cim]
      status[cim] = "regular"
    }
    await mensalidadeService.atualizar({ ...editando, pagos, statusUsuarios: status })
    await carregar()
    setEditando(null)
    setReciboPara(null)
    toast.success("Mês salvo")
  }

  const emitirRecibo = async (cimIrmao: string) => {
    const irmao = await usuarioService.porCim(cimIrmao)
    navigate("/recibo", { state: { nome: irmao?.nome ?? "", cim: cimIrmao } })
  }

  return (
    <>
      <TituloPagina titulo="Secretaria" descricao="Mensalidades, caixa e tronco de beneficência da Loja." />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Saldo mensal e tronco</CardTitle>
            <CardDescription>Mensalidades recebidas menos os custos fixos, mês a mês.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarras} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatarMoeda(v)} />
                <Legend />
                <Bar dataKey="Saldo" fill={COR_PAGO} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tronco" fill={COR_TRONCO} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos do último mês</CardTitle>
              {ultimo && (
                <CardDescription>
                  {ultimo.pagos.length} pagos e {ultimo.irregulares.length} irregulares de {ultimo.totalIrmaos} irmãos
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dadosPizza} dataKey="valor" nameKey="nome" innerRadius={30} outerRadius={55} paddingAngle={2} animationBegin={0} animationDuration={500}>
                    <Cell fill={COR_PAGO} />
                    <Cell fill={COR_IRREGULAR} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caixa livre (tronco)</CardTitle>
              <CardDescription>Disponível para doações voluntárias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-tabular text-2xl font-bold text-ouro">{formatarMoeda(ultimo?.tronco ?? 0)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Balancete anual</CardTitle>
            <CardDescription>Meses fechados só são lidos. Mês aberto a gestão edita.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="w-28 space-y-1">
              <Label htmlFor="ano">Ano</Label>
              <Select
                id="ano"
                value={anoFiltro}
                onChange={(e) => {
                  setAnoFiltro(e.target.value)
                  setMesFiltro("")
                }}
              >
                {anos.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </Select>
            </div>
            <div className="w-28 space-y-1">
              <Label htmlFor="mes">Mês</Label>
              <Select id="mes" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
                <option value="">Todos</option>
                {mesesDoAno.map((m) => (
                  <option key={m.mes} value={m.mes}>{m.mes}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Custos</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Tronco</TableHead>
                <TableHead className="text-center">Pagos</TableHead>
                <TableHead className="text-center">Irregulares</TableHead>
                <TableHead className="text-center">Situação</TableHead>
                {gestor && <TableHead className="w-24" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {balancete.length === 0 && (
                <TableRow>
                  <TableCell colSpan={gestor ? 9 : 8} className="py-8 text-center text-muted-foreground">
                    Nenhum mês cadastrado para este filtro.
                  </TableCell>
                </TableRow>
              )}
              {balancete.map((m) => {
                const original = mensalidades.find((mm) => mm.mes === m.mes && mm.ano === m.ano)
                const aberto = original?.mesFechado === false
                return (
                  <TableRow key={competencia(m.mes, m.ano)}>
                    <TableCell className="font-medium text-secondary-foreground">{competencia(m.mes, m.ano)}</TableCell>
                    <TableCell className="font-tabular text-right">{formatarMoeda(m.receitas)}</TableCell>
                    <TableCell className="font-tabular text-right">{formatarMoeda(m.custos)}</TableCell>
                    <TableCell className={cn("font-tabular text-right font-semibold", m.saldo < 0 ? "text-error-foreground" : "text-primary")}>
                      {formatarMoeda(m.saldo)}
                    </TableCell>
                    <TableCell className="font-tabular text-right">{formatarMoeda(m.tronco)}</TableCell>
                    <TableCell className="text-center">{m.pagos.length}</TableCell>
                    <TableCell className="text-center">{m.irregulares.length}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={aberto ? "warning" : "muted"}>{aberto ? "Aberto" : "Fechado"}</Badge>
                    </TableCell>
                    {gestor && (
                      <TableCell className="text-right">
                        {aberto && original && (
                          <Button size="sm" variant="outline" onClick={() => setEditando(original)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editando !== null} onOpenChange={(aberto) => !aberto && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mês {editando && competencia(editando.mes, editando.ano)}</DialogTitle>
          </DialogHeader>
          {editando && (
            <div className="space-y-5">
              <div>
                <Label>Pagamentos dos irmãos</Label>
                <ul className="mt-2 divide-y rounded-md border">
                  {editando.irmaos.map((cimIrmao) => {
                    const status = editando.statusUsuarios?.[cimIrmao]
                    const pago = editando.pagos.includes(cimIrmao)
                    return (
                      <li key={cimIrmao} className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="w-24 font-tabular text-sm">CIM {cimIrmao}</span>
                          <Switch checked={pago} onCheckedChange={(v) => alternarPagamento(cimIrmao, v)} aria-label={`Pagamento do CIM ${cimIrmao}`} />
                          {status && <Badge variant={VARIANTE_STATUS[status]}>{status}</Badge>}
                        </div>
                        {reciboPara === cimIrmao && (
                          <div className="mt-2 flex items-center gap-2 pl-24 text-sm">
                            <span>Emitir recibo?</span>
                            <Button size="sm" onClick={() => emitirRecibo(cimIrmao)}>
                              <Receipt className="h-3.5 w-3.5" />
                              Sim
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setReciboPara(null)}>Não</Button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tronco">Valor do tronco</Label>
                <Input
                  id="tronco"
                  type="number"
                  min={0}
                  step="0.01"
                  value={editando.tronco}
                  onChange={(e) => setEditando({ ...editando, tronco: Number(e.target.value) })}
                  className="w-40 font-tabular"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditando(null)}>Cancelar</Button>
                <Button onClick={salvar}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
