# itsSecret — Site presente de aniversário

## O que é este projeto

Site presente para a namorada do Tiago no 1º ano de namoro (02/07/2026).
Experiência de **scroll narrativo mobile-first** que virou um mini-jogo: a pessoa
percorre seções de fotos/frases/contador, **coleta 4 itens escondidos** para
desbloquear o capítulo final, responde a uma pergunta e recebe o gran finale.

## Stack

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, sem `tailwind.config.js` — tema em `@theme` no `src/index.css`)
- React Router v8 (só `react-router`, não `react-router-dom`) — uma única rota `/`
- Radix UI (`radix-ui` pacote unificado — primitivos sem estilo)
- Framer Motion (todas as animações de scroll/entrada/finale)
- lucide-react (ícones)
- canvas-confetti (explosões do gran finale)
- Lint: **Oxlint** (`npm run lint`) — sem ESLint

## Dados do relacionamento

- **Data de início:** 02 de julho de 2025, ~22h (`src/data/story.ts`)
- **Contador:** ao vivo, atualiza a cada segundo (`useLiveCounter`)

## Sistema de fotos (importante)

As fotos **não são importadas manualmente**. Um plugin Vite
(`photoManifestPlugin` em `vite.config.ts`) lê `public/photos/<pasta>/` e gera o
módulo virtual `virtual:photo-manifest` com a lista de arquivos, **ordenados
numericamente** por nome. Extensões aceitas: `.webp .jpg .jpeg .png .gif`.

Pastas escaneadas (o nome vira a ordem, ex. `1.webp`, `2.webp`, ...):

| Pasta                         | Usada em                        |
|-------------------------------|---------------------------------|
| `public/photos/01-date`       | polaroid inicial (`firstPhoto`) |
| `public/photos/02-swipe`      | `datePhotos` (pilha arrastável) |
| `public/photos/03-puzzle`     | `adventurePhotos`               |
| `public/photos/04-missoshiro` | `missoshiroPhotos`              |
| `public/photos/05-future`     | `futurePhotos`                  |
| `public/photos/moments`       | `moments`                       |

**Fluxo pra adicionar foto:** solte o arquivo na pasta certa (nomeando `1.webp`,
`2.webp`...) e adicione a legenda no mapa de legendas correspondente em
`story.ts`. O dev server recarrega sozinho ao adicionar/remover arquivos.
Música: `public/music/song.mp3`.

## Arquivo de conteúdo principal

**`src/data/story.ts`** — preencher com conteúdo real antes de publicar:

- `girlfriend` — nome dela (`'Tata'`)
- `startDate` / `startDateLabel` — já preenchido (02/07/2025 22h)
- `firstPhoto` — polaroid da data inicial
- `datePhotos` + `swipeCaptions` — legendas por nome de arquivo
- `whatsappStats` — números da seção WhatsApp
- `adventurePhotos` + `puzzleCaptions`
- `snapchatStreak` — número do streak
- `missoshiroPhotos` + `missoshiroCaptions` (a cachorra)
- `futurePhotos` + `futureCaptions`
- `moments` + `momentsCaptions`
- `musicSrc` — trilha de fundo
- `phrases[]` — frases de amor
- **`finalMessage`** — texto final do Tiago (aparece depois da explosão de "eu te amo muito...") ⚠️ preencher
- **`rewardPhrase`** — frase revelada ao clicar em "Coletar recompensa" (ex. pista tipo "Olhe para frente...") ⚠️ preencher

Legendas são casadas pela **chave = nome do arquivo** (ex. `'3.webp'`); arquivo
sem entrada fica sem legenda.

## Estrutura de pastas relevante

```
src/
  data/story.ts            ← todo o conteúdo personalizado
  routes/Story.tsx         ← orquestra todas as seções + estado do jogo
  components/story/
    IntroModal.tsx         ← tela "você está preparada?" (bloqueia scroll até começar)
    HeroSection.tsx        ← abertura com o nome dela
    CounterSection.tsx     ← contador ao vivo
    DateSection.tsx        ← polaroid da data inicial
    SwipeCardsSection.tsx  ← pilha de fotos arrastável  (coletável: mapa)
    WhatsAppSection.tsx    ← estatísticas de conversa
    AdventureSection.tsx   ← fotos "puzzle"             (coletável: estrela)
    SnapchatSection.tsx    ← streak
    MissoshiroSection.tsx  ← a cachorra                 (coletável: patinha)
    FutureSection.tsx      ← promessas do futuro        (coletável: chave)
    LockGateSection.tsx    ← portão: trava/destrava o capítulo final
    QuestionSection.tsx    ← pergunta final ("Sim" / "Preciso pensar" fujão)
    FinaleSection.tsx      ← gran finale (confete + "eu te amo muito..." + recompensa)
    CollectibleItem.tsx    ← botão do item coletável (reutilizado nas seções)
    InventoryHUD.tsx       ← HUD fixo mostrando itens coletados
    MusicPlayer.tsx        ← <audio> controlado por prop `play`
    SectionScrollHint.tsx  ← seta "role para baixo"
    MomentCard.tsx / PhraseSection.tsx ← cartões de momento/frase
  hooks/
    useLiveCounter.ts      ← contador tempo real (setInterval 1s)
    useScrollReveal.ts     ← animação ao rolar (IntersectionObserver, once)
public/
  photos/<pastas>/         ← fotos (ver "Sistema de fotos")
  music/song.mp3           ← trilha
```

## Comandos

```bash
npm run dev      # dev server em http://localhost:5173
npm run build    # build de produção (roda tsc -b antes do vite build)
npm run lint     # Oxlint
npm run preview  # serve o build de produção
```

## Paleta de cores e fontes

Tema **Rosa Vintage** (definido em `@theme` no `src/index.css`; a paleta
Terracota antiga foi descartada). Usar sempre as classes Tailwind das cores:

- `cream` `#fdf0f0` — fundo principal
- `warm-50/100/200/300` — tons rosados intermediários
- `terracota` `#c0506a` / `terracota-d` `#a84060` — destaque / botões
- `brown` `#7a2040` / `brown-d` `#5a1030` — seções escuras e finais

Fontes (Google Fonts, carregadas no `index.html`), referenciadas via variáveis:
- `var(--font-display)` → **Chilanka** (títulos)
- `var(--font-body)` → **Dongle** (corpo)
- (Sacramento também está disponível)

Utilitários próprios no CSS: `.polaroid`, `.animate-heartbeat`,
`.animate-bounce-slow`, e spacings `safe-t/safe-b/...` (notch/home indicator).

## Mecânica de jogo (coletáveis)

Estado central em `src/routes/Story.tsx` (`inventory: Set<string>`). São **4
itens**, cada um escondido numa seção, coletados via `CollectibleItem`:

| id         | ícone/label | seção      |
|------------|-------------|------------|
| `compass`  | mapa        | SwipeCards |
| `star`     | estrela     | Adventure  |
| `pawprint` | patinha     | Missoshiro |
| `key`      | chave       | Future     |

- `InventoryHUD` mostra o progresso fixo na tela.
- `LockGateSection` fica **travada** (chacoalha se ela tentar passar) até
  `allCollected` (os 4). Ao completar, destrava e o `Story` faz **auto-scroll**
  para a `QuestionSection` (que só aparece quando `allCollected`).
- **Só em DEV** existe um botão "coletar tudo" (canto inferior esquerdo) para
  pular a coleta durante testes — some no build de produção.

## Fluxo da experiência

1. **IntroModal** — "você está preparada?" → botão "Estou pronta ✦" (libera scroll + música)
2. **Hero** — nome dela
3. **Contador ao vivo** — dias/horas/minutos/segundos juntos
4. **Data de início** — polaroid
5. **Seções temáticas** intercaladas (Swipe, WhatsApp, Adventure, Snapchat, Missoshiro, Future) — 4 delas escondem os **coletáveis**
6. **LockGate** — trava até os 4 itens; depois destrava → scroll pra pergunta
7. **Pergunta final** — botão **"Sim"**; o **"Preciso pensar..." é um botão fujão**
   (foge do toque/cursor e nunca pode ser clicado — easter egg)
8. **"Sim"** → **gran finale** (`FinaleSection`, montado só após o Sim):
   - explode confete e a página **arrasta suavemente para baixo**
   - seção inteira de **"Eu te amo muito muito muito..."** que vai **acumulando
     até encher a tela**
   - **texto final** (`finalMessage`)
   - botão **"Coletar recompensa"** (ícone `Gift`) → mais confete + revela a `rewardPhrase`

## Observações

- Mobile-first: quase toda seção é `min-h-svh ... [scroll-snap-align:start]`.
- Antes de publicar: preencher `finalMessage` e `rewardPhrase`, colocar as fotos
  reais nas pastas e conferir as legendas.
