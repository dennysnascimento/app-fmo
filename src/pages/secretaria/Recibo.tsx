import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import html2canvas from "html2canvas"
import { ArrowLeft, Copy, Download, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import logoLoja from "../../assets/fmo.png"
import logoGrandeLoja from "../../assets/grande-loja.png"
import { VALOR_MENSALIDADE } from "../../lib/caixa"
import { formatarMoeda } from "../../lib/formato"
import TituloPagina from "../../components/TituloPagina"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"

interface EstadoRecibo {
  nome?: string
  cim?: string
}

/** Recibo da mensalidade, gerado em imagem para mandar ao irmão pelo WhatsApp. */
export default function Recibo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { nome, cim } = (location.state as EstadoRecibo | null) ?? {}
  const reciboRef = useRef<HTMLDivElement>(null)
  const [imagem, setImagem] = useState<string | null>(null)
  const [gerando, setGerando] = useState(false)

  const gerarImagem = useCallback(async () => {
    if (!reciboRef.current) return
    setGerando(true)
    try {
      const canvas = await html2canvas(reciboRef.current, { backgroundColor: "#ffffff", scale: 2 })
      setImagem(canvas.toDataURL("image/png"))
    } catch {
      toast.error("Não foi possível gerar a imagem do recibo.")
    } finally {
      setGerando(false)
    }
  }, [])

  // Sem irmão informado não há recibo a emitir: volta para a Secretaria.
  useEffect(() => {
    if (!cim && !nome) navigate("/secretaria", { replace: true })
  }, [cim, nome, navigate])

  useEffect(() => {
    // Pequeno atraso para as logos terminarem de renderizar antes da captura.
    const timer = setTimeout(gerarImagem, 150)
    return () => clearTimeout(timer)
  }, [gerarImagem])

  const baixar = () => {
    if (!imagem) return
    const link = document.createElement("a")
    link.href = imagem
    link.download = `recibo_${cim || "pagamento"}.png`
    link.click()
  }

  const copiar = async () => {
    if (!imagem) return
    try {
      const blob = await (await fetch(imagem)).blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      toast.success("Imagem copiada")
    } catch {
      toast.error("O navegador não permitiu copiar a imagem. Use Baixar imagem.")
    }
  }

  return (
    <>
      <TituloPagina
        titulo="Recibo de mensalidade"
        acoes={
          <Button variant="outline" onClick={() => navigate("/secretaria")}>
            <ArrowLeft className="h-4 w-4" />
            Secretaria
          </Button>
        }
      />

      <div className="mx-auto flex max-w-md flex-col items-center gap-5">
        <div ref={reciboRef} className="w-full rounded-xl border bg-white p-6 text-center text-[hsl(0,0%,17%)]">
          <div className="mb-4 flex items-center justify-center gap-6">
            <img src={logoLoja} alt="Loja Flaviano Mendes de Oliveira Nº 43" className="h-14 object-contain" />
            <img src={logoGrandeLoja} alt="Grande Loja" className="h-14 object-contain" />
          </div>
          <h2 className="text-lg font-semibold text-[#2F4E85]">Recibo de Pagamento</h2>
          <p className="text-xs text-[#6E6E6E]">A∴R∴L∴S∴ Flaviano Mendes de Oliveira Nº 43</p>
          <dl className="mt-4 space-y-1.5 text-left text-sm">
            <Linha rotulo="Nome" valor={nome || "Não informado"} />
            <Linha rotulo="CIM" valor={cim || "Não informado"} />
            <Linha rotulo="Valor" valor={formatarMoeda(VALOR_MENSALIDADE)} />
            <Linha rotulo="Situação" valor="Pago" destaque />
            <Linha rotulo="Emitido em" valor={new Date().toLocaleDateString("pt-BR")} />
          </dl>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-3 p-5">
            {gerando && <p className="text-sm text-muted-foreground">Gerando imagem...</p>}
            {imagem && <img src={imagem} alt="Recibo em imagem" className="max-w-xs rounded-md border" />}
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={baixar} disabled={!imagem}>
                <Download className="h-4 w-4" />
                Baixar imagem
              </Button>
              <Button variant="secondary" onClick={copiar} disabled={!imagem}>
                <Copy className="h-4 w-4" />
                Copiar imagem
              </Button>
              <Button variant="ghost" onClick={gerarImagem} disabled={gerando}>
                <ImageIcon className="h-4 w-4" />
                Gerar de novo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function Linha({ rotulo, valor, destaque = false }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-[#e5e5e5] pb-1">
      <dt className="font-medium text-[#6E6E6E]">{rotulo}</dt>
      <dd className={destaque ? "font-semibold text-[#2F4E85]" : ""}>{valor}</dd>
    </div>
  )
}
