# Flex.dev — Landing Page

Landing page mobile-first para a Flex.dev, agência de marketing digital
focada em converter donos de clínicas de medicina ocupacional (SST) em
leads pelo WhatsApp.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (animações de scroll, count-up, transições)

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview   # testa o build localmente
```

## Deploy na Vercel

1. Suba este repositório para o GitHub/GitLab/Bitbucket (ou use `vercel` CLI
   direto na pasta).
2. Na Vercel, importe o projeto — o preset **Vite** é detectado
   automaticamente (build command `npm run build`, output `dist`).
3. Deploy. Sem variáveis de ambiente necessárias.

## O que trocar antes de publicar (placeholders)

Busque por `⚠️ PLACEHOLDER` no código para achar todos os pontos. Resumo:

| Onde | O quê | Arquivo |
| --- | --- | --- |
| Número de WhatsApp / mensagem | Já configurado com o número real | `src/constants.js` |
| Números "antes/depois" da seção de prova | Trocar `261` → `451` pelos dados reais do case | `src/sections/Proof.jsx` |
| Print de resultado | Trocar o bloco pontilhado por uma imagem real (`<img />`) | `src/sections/Proof.jsx` |
| "+16 clientes" | Atualizar a contagem real de clientes | `src/sections/Closing.jsx` |
| Imagem de Open Graph (compartilhamento em redes) | Adicionar `og-image.jpg` em `public/` e descomentar a tag | `index.html` |

## Estrutura

```
src/
  components/   -> Reveal, CountUp, WhatsappButton, StickyWhatsapp (reutilizáveis)
  sections/     -> Hero, Problem, Process, Proof, Closing (uma seção = um bloco da narrativa)
  constants.js  -> link/número do WhatsApp centralizados
  App.jsx       -> monta a ordem das seções
```
