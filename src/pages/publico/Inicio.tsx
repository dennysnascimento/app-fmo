import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Inicio.css"
import videoBg from "../../assets/video.mp4"
import logo from "../../assets/fmo.png"
import grandeLoja from "../../assets/grande-loja.png"
import veneravelMestre from "../../assets/veneravel-mestre.jpeg"
import primeiroVigilante from "../../assets/primeiro-vigilante.jpeg"
import segundoVigilante from "../../assets/segundo-vigilante.png"

import banner1 from "../../assets/banner/loja-maconico-flaviano-ritual-1.png"
import banner2 from "../../assets/banner/loja-maconico-flaviano-ritual-2.png"
import banner3 from "../../assets/banner/loja-maconico-flaviano-ritual-3.png"
import banner4 from "../../assets/banner/loja-maconico-flaviano-ritual-4.png"
import banner5 from "../../assets/banner/loja-maconico-flaviano-ritual-5.png"
import banner6 from "../../assets/banner/loja-maconico-flaviano-ritual-6.png"
import banner7 from "../../assets/banner/loja-maconico-flaviano-ritual-7.png"
import banner8 from "../../assets/banner/loja-maconico-flaviano-ritual-8.png"
import banner9 from "../../assets/banner/loja-maconico-flaviano-ritual-9.png"
import bannerRitual from "../../assets/banner/loja-maconico-flaviano-ritual.jpg"
import bannerRitualPng from "../../assets/banner/loja-maconico-flaviano-ritual.png"
import sessao1 from "../../assets/banner/loja-maconico-flaviano-sessao-1.jpg"
import sessao3 from "../../assets/banner/loja-maconico-flaviano-sessao-3.jpg"

const WHATSAPP = "5581999712812"
const ENDERECO = "R. Profa. Ângela Pinto, 70, Torre, Recife, PE, 50710-010"
const MAPA_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.4845682647467!2d-34.918194!3d-8.038975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab1901c0ade589%3A0x4e4e4e4e4e4e4e4e!2sR.%20Profa.%20%C3%82ngela%20Pinto%2C%2070%20-%20Torre%2C%20Recife%20-%20PE%2C%2050710-010!5e0!3m2!1spt-BR!2sbr!4v1675000000000"

interface Imagem {
  id: number
  src: string
  alt: string
}

const imagens: Imagem[] = [
  { id: 1, src: banner1, alt: "Loja Maçônica Flaviano Mendes, imagem 1" },
  { id: 2, src: banner2, alt: "Loja Maçônica Flaviano Mendes, imagem 2" },
  { id: 3, src: banner3, alt: "Loja Maçônica Flaviano Mendes, imagem 3" },
  { id: 4, src: banner4, alt: "Loja Maçônica Flaviano Mendes, imagem 4" },
  { id: 5, src: banner5, alt: "Loja Maçônica Flaviano Mendes, imagem 5" },
  { id: 6, src: banner6, alt: "Loja Maçônica Flaviano Mendes, imagem 6" },
  { id: 7, src: banner7, alt: "Loja Maçônica Flaviano Mendes, imagem 7" },
  { id: 8, src: banner8, alt: "Loja Maçônica Flaviano Mendes, imagem 8" },
  { id: 9, src: banner9, alt: "Loja Maçônica Flaviano Mendes, imagem 9" },
  { id: 10, src: bannerRitual, alt: "Ritual Maçônico, Loja Flaviano Mendes de Oliveira Nº 43" },
  { id: 11, src: bannerRitualPng, alt: "Loja Maçônica Flaviano Mendes, ritual" },
  { id: 12, src: sessao1, alt: "Sessão Maçônica Flaviano Mendes, Ritual de Aprendiz" },
  { id: 13, src: sessao3, alt: "Rito Schröder, Loja Flaviano Mendes, trabalhos maçônicos" },
]

/** Página pública da Loja: história, rito, gestão, galeria e o convite a candidatos. */
export default function Inicio() {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [idade, setIdade] = useState("")
  const [cidade, setCidade] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [slide, setSlide] = useState(0)
  const [menuAberto, setMenuAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const [imagemAberta, setImagemAberta] = useState<Imagem | null>(null)

  const proximo = () => setSlide((s) => (s + 1) % imagens.length)
  const anterior = () => setSlide((s) => (s - 1 + imagens.length) % imagens.length)

  useEffect(() => {
    document.title = "Loja Maçônica Flaviano Mendes de Oliveira Nº 43 | Rito Schröder, Recife PE"
    const timer = setInterval(proximo, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 50)
    window.addEventListener("scroll", aoRolar, { passive: true })
    return () => window.removeEventListener("scroll", aoRolar)
  }, [])

  const enviarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = [
      "Candidato interessado, Loja Flaviano Mendes de Oliveira Nº 43",
      `Nome: ${nome}`,
      `Idade: ${idade}`,
      `Cidade: ${cidade}`,
      `Mensagem: ${mensagem || "Sem mensagem"}`,
      "Rito: Rito Schröder",
    ].join("\n")
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener")
  }

  return (
    <>
      <header className={`navbar${rolou ? " scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-pequena" />
            <span>Flaviano Mendes Nº 43</span>
          </div>

          <button
            className={`hamburger${menuAberto ? " open" : ""}`}
            onClick={() => setMenuAberto((m) => !m)}
            aria-label="Alternar menu"
            aria-expanded={menuAberto}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <nav className={`navbar-menu${menuAberto ? " open" : ""}`} onClick={() => setMenuAberto(false)}>
            <a href="#inicio" className="nav-link">Início</a>
            <a href="#historia" className="nav-link">História</a>
            <a href="#rito" className="nav-link">O Rito</a>
            <a href="#galeria" className="nav-link">Galeria de fotos</a>
            <a href="#gestao" className="nav-link">Gestão</a>
            <a href="https://flavianomendesdeoliveira43.blogspot.com" className="nav-link" target="_blank" rel="noreferrer">Blog</a>
            <a href="#contato" className="nav-link">Contato</a>
          </nav>
        </div>
        <div className={`menu-overlay${menuAberto ? " show" : ""}`} onClick={() => setMenuAberto(false)} />
      </header>

      <main className="inicio-container">
        <section className="carousel-section" id="inicio">
          <div className="carousel-container">
            <div className="carousel-wrapper">
              {imagens.map((imagem, i) => (
                <div key={imagem.id} className={`carousel-slide${i === slide ? " active" : ""}`}>
                  <img src={imagem.src} alt={imagem.alt} loading={i === 0 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>

            <button className="carousel-btn carousel-btn-prev" onClick={anterior} aria-label="Imagem anterior">&#10094;</button>
            <button className="carousel-btn carousel-btn-next" onClick={proximo} aria-label="Próxima imagem">&#10095;</button>

            <div className="carousel-dots">
              {imagens.map((imagem, i) => (
                <button key={imagem.id} className={`dot${i === slide ? " active" : ""}`} onClick={() => setSlide(i)} aria-label={`Ir para a imagem ${i + 1}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="hero">
          <div className="hero-logos">
            <div className="hero-titulo">
              <img src={logo} alt="Logo da Loja Maçônica Flaviano Mendes" className="hero-logo" />
              <h1>Loja Maçônica<br />Flaviano Mendes<br />de Oliveira Nº 43</h1>
            </div>
          </div>
          <div className="hero-inner">
            <p className="lead">Entre as colunas silenciosas do Templo, há um Rito que conserva a pureza e a simplicidade dos antigos mestres da Arte Real. Nascido do espírito reformador de Friedrich Ludwig Schröder, o Rito Schröder, ou Rito Alemão, é o reencontro da Maçonaria com sua origem mais nobre: a busca da Verdade pela razão, pela moral e pelo trabalho.</p>
            <p className="lead">Quando a ritualística europeia se viu tomada por adornos e vaidades, Schröder levantou-se como guardião da essência. Retirou os excessos, purificou os gestos e devolveu à Maçonaria a sua alma: a da reflexão interior, da ética, da fraternidade e do aperfeiçoamento do ser humano.</p>
            <p className="lead">Em nossa amada A∴R∴L∴S∴ Flaviano Mendes de Oliveira Nº 43, praticamos com honra e zelo este Rito que fala diretamente ao coração dos homens de pensamento e de ação, empresários, profissionais liberais e estudiosos que reconhecem na Maçonaria uma escola viva de caráter e responsabilidade.</p>
            <div className="hero-video">
              <video autoPlay loop muted playsInline preload="metadata">
                <source src={videoBg} type="video/mp4" />
                Seu navegador não reproduz vídeos.
              </video>
            </div>
            <p className="lead">Aqui, cada reunião é um exercício de elevação moral; cada símbolo, um espelho da consciência; cada palavra, um convite à construção silenciosa de um mundo mais humano.</p>
            <p className="lead">O Rito Schröder é o Rito daqueles que preferem a essência à aparência, o trabalho ao discurso, o humanismo ao dogma. É o Rito que ergue homens livres e de bons costumes, firmados sobre os alicerces do humanitarismo, da ética e da razão.</p>
            <p className="lead">Convidamos, pois, irmãos de todos os Orientes e peregrinos sinceros da Verdade a conhecer este caminho.<br />
              Na Flaviano Mendes de Oliveira Nº 43, o Rito Schröder pulsa vivo, como chama que ilumina sem ostentar, como martelo que lapida sem ferir, como símbolo eterno de que a verdadeira Luz habita na simplicidade e na virtude.</p>
          </div>
        </section>

        <section className="about" id="historia">
          <h2>Por que nossa Loja se chama Flaviano Mendes de Oliveira</h2>
          <p>A A∴R∴L∴S∴ Flaviano Mendes de Oliveira Nº 43 recebeu este nome em homenagem a um homem de alegria contagiante, talento múltiplo e coração fraterno: o Ir∴ Flaviano Mendes de Oliveira.</p>
          <p>Filho de comerciantes, Flaviano nasceu em Itaíba, PE, e veio para o Recife ainda na infância, fixando residência no bairro do Ipsep. Desde cedo demonstrou ser uma pessoa de grande carisma, inteligência e dedicação.</p>
          <p>Ingressou por concurso no Banco do Brasil, onde rapidamente se destacou não apenas pela competência profissional, mas também por sua simpatia e disposição em servir. Jornalista por formação e vocação, contribuiu ativamente com os serviços de comunicação do banco e conquistou inúmeros amigos por onde passou.</p>
          <p>De espírito criativo e alegre, foi o idealizador do bloco carnavalesco “BB na Folia” e, mais tarde, do irreverente “O Gato Pingado”, conhecido como o menor bloco do mundo, composto apenas por ele mesmo, mas sempre cheio de entusiasmo e bom humor.</p>
          <p>Flaviano era também músico nato, herança familiar de seu avô Eloi e de seu tio Zé Popô, ambos artistas reconhecidos em sua terra natal. Tocava diversos instrumentos e formou, com amigos, a banda de forró “Mensageiros do Forró”, com a qual levou alegria a muitos encontros e celebrações.</p>
          <p>No convívio entre amigos e colegas, Flaviano era sinônimo de alegria, lealdade e fraternidade. Foi através dessas amizades que ingressou na Maçonaria, contribuindo de forma exemplar para o fortalecimento das colunas da nossa Sublime Ordem.</p>
          <p>Hoje, o Ir∴ Flaviano Mendes de Oliveira habita o Oriente Eterno, mas sua memória permanece viva entre nós. O nome de nossa Loja é, portanto, uma justa homenagem a este irmão querido, cuja vida foi marcada pela luz do amor fraterno, pela arte, pela alegria e pelo exemplo de humanidade.</p>
        </section>

        <section id="rito" className="secao-ancorada">
          <div className="about">
            <h3 className="titulo-rito">O Rito Schröder</h3>
            <p>Rito Schröder (em alemão: Schrödersche Lehrart). Este é um ritual maçônico utilizado por várias lojas na Alemanha. Criado por Friedrich Ulrich Ludwig Schröder e submetido aos Mestres de Hamburgo em 29 de junho de 1801, que o adotaram por unanimidade, desde logo conquistou numerosas Lojas em toda a Alemanha e em outros países, onde passou a ser praticado, principalmente, por maçons de origem alemã, e logo recebeu o cognome de seu fundador.</p>
            <p>Com o declínio do Rito da Estrita Observância, vários maçons estavam descontentes com esse estado de coisas. Dentre eles, destaca-se Friedrich Ludwig Schröder. Grande estudioso da maçonaria, Schröder desenvolveu um conjunto de rituais para as lojas simbólicas, fundamentado em dois princípios: o primeiro, o resgate dos princípios da maçonaria britânica; o segundo, buscar a simplicidade, eliminando elementos que ele considerava incompatíveis com a maçonaria moderna.</p>
            <p>Schröder se baseou em manuscritos ingleses tais como "Três batidas distintas" e "Maçonaria dissecada". Estudou vários ritos europeus e aboliu os chamados altos graus, aproximando-se da filosofia dos Modernos. Schröder e sua comissão ritualística obtiveram grande aceitação da maçonaria alemã ao seu rito, de caráter humanista e rara beleza.</p>
          </div>
        </section>

        <section id="gestao" className="secao-ancorada">
          <div className="gestao-section">
            <h2>Nossa Gestão Atual</h2>
            <p className="section-subtitle">Conheça os dirigentes de nossa Loja</p>
            <div className="gestao-cards">
              <Dirigente foto={veneravelMestre} cargo="Venerável Mestre" nome="Daniel Figueiredo" />
              <Dirigente foto={primeiroVigilante} cargo="1º Vigilante" nome="André Felix" />
              <Dirigente foto={segundoVigilante} cargo="2º Vigilante" nome="Alamy Neto" />
            </div>
          </div>
        </section>

        <section className="calendario-section">
          <h2>Calendário de Atividades</h2>
          <p className="section-subtitle">Datas e horários das nossas sessões</p>
          <div className="calendario-info">
            <div className="info-item">
              <h3>Sessões regulares</h3>
              <p>Terças-feiras</p>
            </div>
            <div className="info-item">
              <h3>Horário</h3>
              <p>19:30</p>
            </div>
            <div className="info-item">
              <h3>Local</h3>
              <p>R. Profa. Ângela Pinto, 70, Torre<br />Recife, PE, 50710-010</p>
            </div>
          </div>
        </section>

        <section id="galeria" className="galeria-section">
          <div className="galeria-header">
            <h2>Galeria de fotos</h2>
            <p className="section-subtitle">Momentos da nossa Loja Maçônica e do Rito Schröder</p>
          </div>
          <div className="galeria-grid">
            {imagens.map((imagem) => (
              <button key={imagem.id} type="button" className="galeria-item" onClick={() => setImagemAberta(imagem)} aria-label={`Abrir imagem: ${imagem.alt}`}>
                <img src={imagem.src} alt={imagem.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        <section id="contato" className="secao-ancorada">
          <div className="form-section">
            <h2>Quero ser candidato</h2>
            <p className="form-intro">Preencha o formulário e envie sua intenção pelo WhatsApp para nossa equipe. Visite nosso templo, no Recife.</p>

            <div className="form-container">
              <div className="form-column">
                <form className="contact-form" onSubmit={enviarWhatsApp}>
                  <div className="form-group">
                    <label htmlFor="nome">Nome completo</label>
                    <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="idade">Idade</label>
                      <input id="idade" type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="18" required min={16} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cidade">Cidade</label>
                      <input id="cidade" type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Sua cidade" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mensagem">Mensagem (opcional)</label>
                    <textarea id="mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Conte sobre seu interesse na Maçonaria" />
                  </div>
                  <div className="actions">
                    <button type="submit" className="btn-primary">Enviar pelo WhatsApp</button>
                    <a className="btn-secondary" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Abrir conversa</a>
                  </div>
                </form>
              </div>

              <div className="map-column">
                <div className="map-header">
                  <h3>Localização do Templo</h3>
                  <p className="address-info">{ENDERECO}</p>
                </div>
                <iframe
                  className="google-map"
                  src={MAPA_URL}
                  title="Localização da Loja Maçônica Flaviano Mendes"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="inicio-footer">
          <img src={grandeLoja} alt="Grande Loja" className="footer-grande-loja" />
          <button type="button" className="footer-entrar" onClick={() => navigate("/login")}>
            wer ist da?
          </button>
        </footer>

        {imagemAberta && (
          <div className="gallery-modal open" onClick={() => setImagemAberta(null)}>
            <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="gallery-modal-close" onClick={() => setImagemAberta(null)} aria-label="Fechar imagem">×</button>
              <img src={imagemAberta.src} alt={imagemAberta.alt} />
            </div>
          </div>
        )}
      </main>
    </>
  )
}

function Dirigente({ foto, cargo, nome }: { foto: string; cargo: string; nome: string }) {
  return (
    <div className="card">
      <div className="card-photo">
        <img src={foto} alt={`${nome}, ${cargo}`} loading="lazy" />
      </div>
      <h3>{cargo}</h3>
      <p className="card-name">{nome}</p>
    </div>
  )
}
