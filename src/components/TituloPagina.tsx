import { ReactNode } from "react"

interface Props {
  titulo: string
  descricao?: string
  acoes?: ReactNode
}

/** Cabeçalho padrão das telas internas: título, uma linha de contexto e as ações à direita. */
export default function TituloPagina({ titulo, descricao, acoes }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-foreground">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acoes && <div className="flex items-center gap-2">{acoes}</div>}
    </div>
  )
}
