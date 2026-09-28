import { useCallback, useEffect, useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../contexts/AuthContext"
import { LIMITE_CARACTERES, postService } from "../../services/postService"
import { Post } from "../../types/post"
import { ehGestor } from "../../lib/gestao"
import { formatarDataHora } from "../../lib/formato"
import TituloPagina from "../../components/TituloPagina"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { cn } from "../../lib/utils"

export default function Feed() {
  const { usuario, cim, gestor } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [novoPost, setNovoPost] = useState("")
  const [comentando, setComentando] = useState<string | null>(null)
  const [comentario, setComentario] = useState("")

  const autor = usuario?.nome ?? (cim ? `CIM ${cim}` : "Convidado")

  const carregar = useCallback(async () => setPosts(await postService.listar()), [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const publicar = async (e: React.FormEvent) => {
    e.preventDefault()
    const texto = novoPost.trim()
    if (!texto) {
      toast.error("Escreva a mensagem antes de publicar.")
      return
    }
    await postService.publicar({ autor, conteudo: texto, data: new Date().toISOString(), cim: cim ?? undefined })
    setNovoPost("")
    await carregar()
    toast.success("Publicado")
  }

  const comentar = async (post: Post) => {
    const texto = comentario.trim()
    if (!texto) return
    await postService.comentar(post.data, { autor, data: new Date().toISOString(), texto })
    setComentario("")
    setComentando(null)
    await carregar()
  }

  return (
    <>
      <TituloPagina titulo="Feed da Loja" descricao="Avisos da gestão e conversa entre os irmãos." />

      <div className="mx-auto max-w-2xl space-y-4">
        {gestor ? (
          <Card>
            <CardContent className="p-5">
              <form onSubmit={publicar} className="space-y-3">
                <Textarea
                  value={novoPost}
                  onChange={(e) => setNovoPost(e.target.value.slice(0, LIMITE_CARACTERES))}
                  maxLength={LIMITE_CARACTERES}
                  placeholder="Escreva um aviso ou novidade para a Loja"
                  className="min-h-[90px]"
                />
                <div className="flex items-center justify-between">
                  <span className="font-tabular text-xs text-muted-foreground">
                    {novoPost.length}/{LIMITE_CARACTERES}
                  </span>
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-sm text-muted-foreground">Só a gestão publica. Todos os irmãos podem comentar.</p>
        )}

        {posts.map((post) => {
          const daGestao = ehGestor(post.cim)
          return (
            <Card key={post.data} className={cn(daGestao && "border-ouro/60 bg-ouro/5")}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-secondary-foreground">{post.autor}</span>
                    {daGestao && <Badge variant="ouro">Gestão</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatarDataHora(post.data)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{post.conteudo}</p>

                <div className="mt-4 space-y-2 border-t pt-3">
                  {(post.comentarios ?? []).map((c, i) => (
                    <div key={i} className="rounded-md bg-muted px-3 py-2 text-sm">
                      <span className="font-medium">{c.autor}</span>
                      <span className="text-muted-foreground"> · {formatarDataHora(c.data)}</span>
                      <p className="mt-0.5">{c.texto}</p>
                    </div>
                  ))}

                  {comentando === post.data ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        comentar(post)
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        autoFocus
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value.slice(0, LIMITE_CARACTERES))}
                        maxLength={LIMITE_CARACTERES}
                        placeholder="Seu comentário"
                      />
                      <Button type="submit" size="sm">Enviar</Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setComentando(null)
                          setComentario("")
                        }}
                      >
                        Cancelar
                      </Button>
                    </form>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setComentando(post.data)}>
                      <MessageSquare className="h-4 w-4" />
                      Comentar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
