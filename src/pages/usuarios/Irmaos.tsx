import { useCallback, useEffect, useState } from "react"
import { Eye, KeyRound, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { usuarioService } from "../../services/usuarioService"
import { extractError } from "../../services/api"
import { GRAUS, Usuario, UsuarioForm } from "../../types/usuario"
import { ehGestor } from "../../lib/gestao"
import TituloPagina from "../../components/TituloPagina"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select } from "../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"

const FORM_VAZIO: UsuarioForm = { nome: "", CIM: "", Grau: "", celular: "", senha: "" }

/** Cadastro de irmãos, mantido pela gestão contra a API. */
export default function Irmaos() {
  const [irmaos, setIrmaos] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState<UsuarioForm>(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState<Usuario["id"] | null>(null)
  const [formAberto, setFormAberto] = useState(false)
  const [detalhe, setDetalhe] = useState<(Usuario & { senha?: string }) | null>(null)
  const [novaSenha, setNovaSenha] = useState("")
  const [excluindo, setExcluindo] = useState<Usuario | null>(null)
  const [salvando, setSalvando] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setIrmaos(await usuarioService.listar())
    } catch (err) {
      setIrmaos([])
      toast.error("Cadastro indisponível", { description: extractError(err) })
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const abrirNovo = () => {
    setForm(FORM_VAZIO)
    setEditandoId(null)
    setFormAberto(true)
  }

  const abrirEdicao = async (irmao: Usuario) => {
    try {
      const completo = (await usuarioService.buscar(irmao.id)) as Usuario & { senha?: string }
      setForm({
        nome: completo.nome ?? "",
        CIM: completo.CIM ?? "",
        Grau: (completo.Grau as UsuarioForm["Grau"]) ?? "",
        celular: completo.celular ?? "",
        senha: completo.senha ?? "",
      })
      setEditandoId(irmao.id)
      setFormAberto(true)
    } catch (err) {
      toast.error("Não foi possível abrir o cadastro", { description: extractError(err) })
    }
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) return toast.error("Informe o nome.")
    if (!form.CIM.trim()) return toast.error("Informe o CIM.")
    if (!form.Grau) return toast.error("Escolha o grau.")
    if (!editandoId && !form.senha) return toast.error("Informe a senha.")
    setSalvando(true)
    try {
      if (editandoId) await usuarioService.atualizar(editandoId, form)
      else await usuarioService.criar(form)
      toast.success(editandoId ? "Cadastro atualizado" : "Irmão cadastrado")
      setFormAberto(false)
      await carregar()
    } catch (err) {
      toast.error("Não foi possível salvar", { description: extractError(err) })
    } finally {
      setSalvando(false)
    }
  }

  const abrirDetalhe = async (irmao: Usuario) => {
    try {
      const completo = (await usuarioService.buscar(irmao.id)) as Usuario & { senha?: string }
      setDetalhe(completo)
      setNovaSenha(completo.senha ?? "")
    } catch (err) {
      toast.error("Não foi possível abrir o cadastro", { description: extractError(err) })
    }
  }

  const salvarSenha = async () => {
    if (!detalhe) return
    if (!novaSenha) return toast.error("Informe a nova senha.")
    setSalvando(true)
    try {
      await usuarioService.atualizar(detalhe.id, { senha: novaSenha })
      toast.success("Senha alterada")
      setDetalhe(null)
    } catch (err) {
      toast.error("Não foi possível alterar a senha", { description: extractError(err) })
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    if (!excluindo) return
    setSalvando(true)
    try {
      await usuarioService.excluir(excluindo.id)
      toast.success("Irmão excluído")
      setExcluindo(null)
      await carregar()
    } catch (err) {
      toast.error("Não foi possível excluir", { description: extractError(err) })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <TituloPagina
        titulo="Irmãos"
        descricao="Cadastro dos irmãos da Loja: nome, CIM, grau e contato."
        acoes={
          <Button onClick={abrirNovo}>
            <Plus className="h-4 w-4" />
            Novo irmão
          </Button>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CIM</TableHead>
            <TableHead>Grau</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead className="w-40 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carregando && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Carregando...</TableCell>
            </TableRow>
          )}
          {!carregando && irmaos.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Nenhum irmão cadastrado. Confira se a API está no ar.
              </TableCell>
            </TableRow>
          )}
          {irmaos.map((u) => (
            <TableRow key={String(u.id)}>
              <TableCell className="font-medium">
                <span className="flex items-center gap-2">
                  {u.nome}
                  {ehGestor(u.CIM) && <Badge variant="ouro">Gestão</Badge>}
                </span>
              </TableCell>
              <TableCell className="font-tabular">{u.CIM}</TableCell>
              <TableCell>{u.Grau}</TableCell>
              <TableCell>{u.celular}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => abrirDetalhe(u)} aria-label={`Ver ${u.nome}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => abrirEdicao(u)} aria-label={`Editar ${u.nome}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setExcluindo(u)} aria-label={`Excluir ${u.nome}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={formAberto} onOpenChange={setFormAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editandoId ? "Editar irmão" : "Novo irmão"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cim">CIM</Label>
                <Input
                  id="cim"
                  inputMode="numeric"
                  value={form.CIM}
                  onChange={(e) => setForm({ ...form, CIM: e.target.value.replace(/\D/g, "") })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grau">Grau</Label>
                <Select id="grau" value={form.Grau} onChange={(e) => setForm({ ...form, Grau: e.target.value as UsuarioForm["Grau"] })} required>
                  <option value="">Selecione</option>
                  {GRAUS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="celular">Celular com DDD</Label>
                <Input id="celular" inputMode="tel" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">{editandoId ? "Senha (deixe como está para manter)" : "Senha"}</Label>
                <Input id="senha" type="password" autoComplete="new-password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setFormAberto(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvando}>{editandoId ? "Atualizar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detalhe !== null} onOpenChange={(aberto) => !aberto && setDetalhe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dados do irmão</DialogTitle>
          </DialogHeader>
          {detalhe && (
            <div className="space-y-4">
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Nome</dt>
                <dd className="font-medium">{detalhe.nome}</dd>
                <dt className="text-muted-foreground">CIM</dt>
                <dd className="font-tabular">{detalhe.CIM}</dd>
                <dt className="text-muted-foreground">Grau</dt>
                <dd>{detalhe.Grau}</dd>
                <dt className="text-muted-foreground">Celular</dt>
                <dd>{detalhe.celular || "Não informado"}</dd>
              </dl>
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="nova-senha">Nova senha</Label>
                <div className="flex gap-2">
                  <Input id="nova-senha" type="password" autoComplete="new-password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                  <Button onClick={salvarSenha} disabled={salvando}>
                    <KeyRound className="h-4 w-4" />
                    Salvar senha
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={excluindo !== null} onOpenChange={(aberto) => !aberto && setExcluindo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir irmão</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            O cadastro de <strong>{excluindo?.nome}</strong> será removido. Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setExcluindo(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={excluir} disabled={salvando}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
