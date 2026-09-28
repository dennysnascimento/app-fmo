# Convenções do app-fmo

Aplicação da A∴R∴L∴S∴ Flaviano Mendes de Oliveira Nº 43: página pública da Loja e área interna
(feed, ritual, secretaria, cadastro de irmãos). O código e o texto de tela seguem as regras
abaixo, pensadas para o que a Loja é: um sistema de irmãos para irmãos, não um ERP.

## Texto de tela

- Tudo em português do Brasil. Os termos da Loja ficam como a Loja fala: irmão, CIM, grau,
  tronco, Venerável, Vigilante, palavra-passe, sessão.
- Frase afirmativa e curta. Sem `Basta`, `É só`, `Ops`, exclamação ou emoji em texto de sistema.
  Emoji e humor ficam para o feed, que é conversa entre irmãos, não para rótulo, erro ou botão.
- Sem ` - ` no meio da frase: vírgula, dois-pontos ou ponto.
- Erro diz o que aconteceu e o que fazer, sem pedir desculpas e sem culpar quem usa.

```
Ruim:  💀 Palavra Passe INCORRETA! Você despertou a fúria dos antigos!
Bom:   Palavra-passe incorreta.

Ruim:  Não foi possível realizar a operação.
Bom:   Não foi possível falar com o servidor. Confira se a API está no ar.
```

- Botão diz a ação (`Publicar`) e a confirmação usa o mesmo verbo (`Publicado`).
- O rótulo carrega a exigência: `Celular com DDD`, não `Celular` com "informe com DDD" embaixo.
- Descrição de campo só quando há consequência que a pessoa não adivinharia.

## Regras gerais

- TypeScript em tudo (`.ts`/`.tsx`); nenhum `.js`/`.jsx` novo em `src/`.
- Tela nova entra em `pages/<área>/`, carregada com `lazy()` em `App.tsx`. Só o Login entra no
  bundle inicial.
- Rota interna sempre dentro de `ProtectedRoute`; o que é só da gestão, dentro de
  `ProtectedRoute somenteGestor`. A lista de CIMs da gestão vive em `lib/gestao.ts` e em nenhum
  outro lugar.
- Toda chamada à API passa por `services/api.ts`; a tela nunca importa `axios`. Erro de API vai
  para o `toast` com `extractError`.
- Enquanto uma entidade não existe na API, o service dela guarda no `localStorage` com carga
  inicial de `src/data/*.json` (ver `mensalidadeService`). Trocar por API é mexer só no service.
- Componentes de interface em `components/ui/` (padrão shadcn/ui); estilo por classes Tailwind
  e tokens de `index.css`. Cor solta em `style={{}}` só onde a tela é autocontida de propósito
  (página pública e Ritual, que têm CSS próprio).
- Segredo e endereço de ambiente vêm de `REACT_APP_*`; nada disso no código nem em `.env`
  versionado. O `.env.example` documenta cada variável.
- Ícones do `lucide-react`; notificação com `sonner`; gráfico com `recharts`.
- Antes de subir: `npm run typecheck`, `npm test` e `npm run build`.
