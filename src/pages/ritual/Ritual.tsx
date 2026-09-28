import { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import ritualData from "../../data/ritual.json"
import { Ritual as RitualTipo } from "../../types/ritual"
import "./Ritual.css"

const ritual = ritualData as RitualTipo

/**
 * Leitor do Ritual de Aprendiz. Tela cheia, fora do Layout: é leitura em sessão, sem menu do
 * sistema em cima. Tem tamanho de fonte e alto contraste próprios.
 */
export default function Ritual() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [selecionado, setSelecionado] = useState<number | null>(ritual.capitulos[0]?.id ?? null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [configAberta, setConfigAberta] = useState(false)
  const [tamanhoFonte, setTamanhoFonte] = useState(1)
  const [contraste, setContraste] = useState(false)
  const menuRef = useRef<HTMLElement>(null)

  const indice = useMemo(() => ritual.capitulos.findIndex((c) => c.id === selecionado), [selecionado])
  const capitulo = indice >= 0 ? ritual.capitulos[indice] : null
  const anterior = indice > 0 ? ritual.capitulos[indice - 1] : null
  const proximo = indice >= 0 && indice < ritual.capitulos.length - 1 ? ritual.capitulos[indice + 1] : null

  const selecionar = (id: number) => {
    setSelecionado(id)
    setMenuAberto(false)
  }

  const navegarTeclado = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!menuRef.current) return
    const itens = menuRef.current.querySelectorAll<HTMLButtonElement>(".ritual-menu-item")
    if (e.key === "ArrowDown" && idx < itens.length - 1) {
      e.preventDefault()
      itens[idx + 1].focus()
    }
    if (e.key === "ArrowUp" && idx > 0) {
      e.preventDefault()
      itens[idx - 1].focus()
    }
  }

  return (
    <div className={`ritual-layout${contraste ? " ritual-contrast" : ""}`}>
      <button className="ritual-menu-toggle" aria-label="Abrir capítulos" onClick={() => setMenuAberto((m) => !m)}>
        ☰
      </button>
      <button className="ritual-config-btn" aria-label="Configurações de leitura" onClick={() => setConfigAberta((v) => !v)}>
        <Settings size={28} />
      </button>

      {configAberta && (
        <div className="ritual-config-menu ritual-config-menu-center" role="dialog" aria-label="Configurações de leitura">
          <button onClick={() => navigate("/loja")} className="ritual-voltar-btn-modal">Voltar à Loja</button>
          <button onClick={() => setTamanhoFonte((f) => Math.min(f + 0.1, 2))}>A+</button>
          <button onClick={() => setTamanhoFonte((f) => Math.max(f - 0.1, 0.7))}>A-</button>
          <button onClick={() => setContraste((c) => !c)}>{contraste ? "Contraste normal" : "Alto contraste"}</button>
          <button onClick={() => setConfigAberta(false)}>Fechar</button>
        </div>
      )}

      <aside className={`ritual-menu${menuAberto ? " open" : ""}`} ref={menuRef} aria-label="Capítulos do Ritual">
        <ul className="ul-ritual">
          {ritual.capitulos.map((cap, idx) => {
            const ativo = selecionado === cap.id
            return (
              <li key={cap.id}>
                <button
                  className={`ritual-menu-item${ativo ? " selected" : ""}`}
                  aria-current={ativo ? "page" : undefined}
                  onClick={() => selecionar(cap.id)}
                  onKeyDown={(e) => navegarTeclado(e, idx)}
                >
                  <Marcador ativo={ativo} />
                  <span className="ritual-menu-title">{cap.titulo}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <main className="ritual-content" style={{ fontSize: `${tamanhoFonte}em` }}>
        {usuario && (
          <div className="ritual-usuario-logado">
            Irmão: {usuario.nome} <span style={{ fontSize: 12, color: "#bfa13a" }}>({usuario.Grau})</span>
          </div>
        )}
        <div className="ritual-content-box">
          {capitulo && <h2 className="ritual-content-title">{capitulo.titulo}</h2>}
          {/* O conteúdo vem em HTML do acervo da própria Loja (docs/acervo), não de quem usa a tela. */}
          <article
            className="ritual-article"
            tabIndex={0}
            aria-label={capitulo?.titulo}
            dangerouslySetInnerHTML={{ __html: capitulo?.conteudo || "<p>Selecione um capítulo.</p>" }}
          />
          {capitulo && <div className="ritual-content-footer">Página {capitulo.id}</div>}
        </div>
        <div className="ritual-nav-btns">
          <button onClick={() => anterior && setSelecionado(anterior.id)} disabled={!anterior}>&larr; Anterior</button>
          <button onClick={() => proximo && setSelecionado(proximo.id)} disabled={!proximo}>Próximo &rarr;</button>
        </div>
      </main>
    </div>
  )
}

function Marcador({ ativo }: { ativo: boolean }) {
  return (
    <span className={`ritual-marker${ativo ? " marker-active" : ""}`} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" fill={ativo ? "#bfa13a" : "#ffe600"} stroke="#bfa13a" strokeWidth="2" />
      </svg>
    </span>
  )
}
