# Documentação Geral — Pasta `Basepedro`

Esta pasta contém um jogo completo de **Texas Hold'em** feito em **HTML5, CSS3 e JavaScript puro**. A versão publicável agora usa **Node.js apenas como ferramenta de build/desenvolvimento** (Vite), sem TypeScript, sem backend e sem banco de dados. O resultado do build (`dist/`) é um site estático.

Os arquivos originais (versão de arquivo único, CSS/JS separados e ZIP) foram preservados em `Basepedro/legacy/` para consulta e comparação.

Este documento explica:

1. O que existe em cada arquivo.
2. O que o código faz, em nível de arquitetura e de funções.
3. Como executar, jogar e personalizar o jogo.

---

## 1. Visão geral do projeto

| Item | Descrição |
|---|---|
| Nome do jogo | Royal Texas Hold'em |
| Gênero | Poker Texas Hold'em contra a CPU |
| Tecnologias | HTML5, CSS3, JavaScript (ES6+), Vite |
| Dependências | Vite (somente desenvolvimento) |
| Build | `npm run build` → `dist/` (site estático) |
| Idiomas | Português (pt-BR) e Inglês (en) |
| Modos | `1x1` (Heads-Up) e `4x1` (você + 3 CPUs) |
| Dificuldades | Fácil, Médio, Difícil |
| Fichas iniciais | 1.000 por jogador |
| Blinds | 10 (small) / 20 (big) |
| Recursos | Avaliador de mão de 7 cartas, side pots, IA, sons sintetizados, animações, ranking de mãos, guia de ações e histórico |

O jogo é totalmente **client-side**: não há servidor, banco de dados, login ou persistência. Fechar/atualizar a página reinicia tudo.

---

## 2. Inventário de arquivos

| Arquivo | Tipo | Função |
|---|---|---|
| `package.json` | Node | Metadados, scripts `dev`, `build` e `preview`, dependências de desenvolvimento |
| `package-lock.json` | Node | Travamento de versões para `npm ci` no Render |
| `vite.config.js` | Config | Define `Basepedro` como raiz e `dist/` como saída do build |
| `render.yaml` | Config | Blueprint do Render: Static Site, build e headers |
| `.node-version` | Config | Fixa Node 22 no build do Render |
| `.gitignore` | Config | Ignora `node_modules/`, `dist/`, logs e arquivos locais |
| `Basepedro/index.html` | HTML | Entrada do Vite; carrega `/src/main.js` |
| `Basepedro/src/main.js` | JavaScript | Importa o CSS e chama `boot()` |
| `Basepedro/src/style.css` | CSS | Aparência da mesa, cartas 3D, animações e responsividade |
| `Basepedro/src/game/engine.js` | JavaScript | Estado, baralho, avaliador de mãos, força pré-flop, draws e side pots |
| `Basepedro/src/game/ai.js` | JavaScript | Decisão da CPU por dificuldade |
| `Basepedro/src/game/i18n.js` | JavaScript | Textos em português e inglês |
| `Basepedro/src/game/audio.js` | JavaScript | Efeitos sonoros via Web Audio |
| `Basepedro/src/game/ui.js` | JavaScript | Cache do DOM, animações, assentos, modais, log e controles |
| `Basepedro/src/game/game.js` | JavaScript | Fluxo da partida, apostas, fases, showdown e eventos |
| `Basepedro/src/game/utils.js` | JavaScript | Utilitário `sleep` |
| `Basepedro/legacy/` | Legado | `script.js`, `style.css`, HTMLs autônomos e ZIP originais |
| `DOCUMENTACAO.md` | Doc | Este documento |

### 2.1 Relação entre os arquivos

- **Versão principal/recomendada:** projeto Vite em `Basepedro/`, com código modular em `Basepedro/src/`.
- `Basepedro/index.html` é a entrada; ele carrega `src/main.js`, que por sua vez importa o CSS e o controlador do jogo.
- O código foi dividido por responsabilidade: regras puras em `engine.js`, IA em `ai.js`, textos em `i18n.js`, som em `audio.js`, DOM/UI em `ui.js` e fluxo da partida em `game.js`.
- `Basepedro/legacy/` preserva os arquivos originais:
  - `script.js` e `style.css`: versão anterior de arquivo separado.
  - `royal-texas-holdem-completo.html`: HTML com CSS/JS embutidos, equivalente à versão antiga.
  - `poker_texas_hold_em.html`: variante de interface com rodapé/modal de ajuda diferentes.
  - `royal-texas-holdem-v2.zip`: pacote da versão antiga com README.
- Os arquivos de `legacy/` **não entram no build** do Vite. Eles servem como referência histórica.

---

## 3. Como executar e jogar

### 3.1 Execução

**Desenvolvimento:**

```bash
npm install
npm run dev
# abra a URL exibida pelo Vite
```

**Build de produção:**

```bash
npm run build
npm run preview
# o build fica em dist/
```

**Publicação no Render (Static Site):**

- Build Command: `npm ci --include=dev && npm run build`
- Publish Directory: `dist`
- O `render.yaml` já contém essa configuração.

**Versões legadas (não fazem parte do build):**

- Abra `Basepedro/legacy/royal-texas-holdem-completo.html` ou `Basepedro/legacy/poker_texas_hold_em.html` diretamente.
- O ZIP está em `Basepedro/legacy/royal-texas-holdem-v2.zip`.

Requisitos: Node 22+ para desenvolvimento/build e navegador moderno (Chrome, Edge, Firefox ou Safari) para jogar. O som usa Web Audio API e só começa após uma interação do usuário, conforme a política de autoplay dos navegadores.

### 3.2 Fluxo de uso

1. **Menu inicial**
   - Escolha o idioma (`Português` ou `English`).
   - Escolha o modo: `1x1` ou `4x1`.
   - Escolha a dificuldade: `Fácil`, `Médio` ou `Difícil`.
   - Clique em **Iniciar Partida**.
2. **Mesa**
   - Você ocupa o assento inferior (`Você`).
   - Os blinds são postados automaticamente: 10 (SB) e 20 (BB).
   - O dealer (botão `D`) gira a cada mão.
3. **Sua vez**
   - **Desistir**: sai da mão.
   - **Passar (Check)** ou **Pagar (Call)**: o rótulo muda conforme exista aposta.
   - **Apostar/Aumentar**: use o slider e os presets `Mín`, `1/2 Pote`, `Pote`, `All-In`.
   - Clique em **Passar vs Aumentar** para abrir o guia contextual.
4. **Barra superior**
   - **Histórico**: mostra o log da mesa (até 45 entradas).
   - **Ranking**: mostra as 10 combinações de mão, da maior para a menor.
   - **Som**: alterna som ligado/desligado.
   - **Menu**: reabre o menu; **Continuar Partida Atual** volta ao jogo em andamento.
5. **Fim de mão**
   - Todos desistiram: vencedor leva o pote.
   - Showdown: cartas das CPUs são reveladas, a melhor mão vence e as 5 cartas vencedoras são destacadas.
   - A próxima mão começa automaticamente.
6. **Fim de partida**
   - Você vence se eliminar todos os oponentes.
   - Você perde se ficar sem fichas.
   - Use **Jogar Novamente** ou **Voltar ao Menu**.

### 3.3 Regras implementadas

- Texas Hold'em No-Limit com 2 ou 4 jogadores.
- Cada jogador começa com 1.000 fichas; não há rebuy.
- Small blind 10, big blind 20, fixos.
- Em `1x1`: o dealer também é o small blind e age primeiro no pré-flop; no pós-flop, o big blind (não-dealer) age primeiro.
- Em `4x1`: SB é o próximo após o dealer, BB é o seguinte, e o primeiro a agir no pré-flop é o próximo após o BB. No pós-flop, o primeiro a agir é o próximo após o dealer.
- Fases: **Pré-flop → Flop (3 cartas) → Turn (1) → River (1) → Showdown**.
- Antes de cada fase comunitária, uma carta é "queimada" (burn).
- Apostas mínimas: abertura mínima de 20; aumento mínimo igual ao último aumento (ou 20 no início).
- All-in cria **side pots** automaticamente quando há contribuições diferentes.
- Empate divide o pote; a sobra de 1 ficha é distribuída aos vencedores em ordem de iteração.
- Se sobrar apenas um jogador ativo antes do showdown, ele leva o pote sem revelar cartas.
- Jogador com 0 fichas é marcado como eliminado; quando resta um, a partida termina.

---

## 4. Arquitetura do código

A versão Vite mantém a mesma lógica da versão original, agora distribuída em módulos ES:

```
Basepedro/src/
  main.js          → importa style.css e chama boot()
  game/
    engine.js      → state, baralho, avaliador, força pré-flop, draws, side pots
    ai.js          → computeCpuDecision
    i18n.js        → I18N (pt/en)
    audio.js       → SoundFX + instância sfx
    ui.js          → dom, animações, assentos, modais, log, controles
    game.js        → fluxo da partida, apostas, fases, showdown, eventos
    utils.js       → sleep
```

Dependências:

```
main.js
  └─ game.js
       ├─ engine.js
       ├─ ai.js ──────────┐
       ├─ i18n.js         │
       ├─ audio.js        │
       ├─ utils.js        │
       └─ ui.js ──────────┘
```

O detalhamento abaixo usa como referência os números de linha do código original em `Basepedro/legacy/script.js`. A versão modular preserva as mesmas funções e regras.

### 4.1 Estado global (`state`)

Definido em `Basepedro/src/game/engine.js`, concentra toda a partida:

```js
const state = {
  lang: 'pt',
  mode: '1v1',
  difficulty: 'medium',
  matchActive: false,
  handNumber: 0,
  smallBlind: 10,
  bigBlind: 20,
  players: [],
  deck: [],
  community: [],
  phase: 'preflop',
  dealerIdx: 0,
  turnIdx: 0,
  currentBet: 0,
  minRaise: 20,
  pot: 0,
  displayedValues: { pot: 0, stacks: [1000, 1000, 1000, 1000] },
  handInProgress: false,
  waitingForHuman: false,
  logEntries: []
};
```

Cada jogador em `state.players` tem:

| Campo | Significado |
|---|---|
| `seatId` | Assento visual: 0 embaixo (humano), 1 topo, 2 direita, 3 esquerda |
| `name` | Nome exibido |
| `isHuman` | `true` somente para você |
| `stack` | Fichas disponíveis |
| `bet` | Fichas apostadas na rodada atual |
| `totalContributed` | Total apostado na mão (usado nos side pots) |
| `cards` | Cartas privadas |
| `folded` | Desistiu da mão |
| `allIn` | Sem fichas, mas ainda na mão |
| `eliminated` | Sem fichas entre mãos |
| `actedThisRound` | Já agiu na rodada atual |

`state.displayedValues` guarda os valores "animados" para a interpolação visual de pot e stacks.

### 4.2 Cache de DOM (`dom`)

Definido em `Basepedro/src/game/ui.js`, guarda referências aos elementos usados com frequência (`menuOverlay`, `potAmount`, `betSlider`, botões etc.) para evitar consultas repetidas ao DOM.

---

## 5. `index.html` — estrutura da tela

### 5.1 Cabeçalho (`Basepedro/index.html:10-34`)

- `.brand`: logotipo com `♠`, título e badge do modo (`1x1 • MÉDIO`).
- Botões: histórico (`btn-log-toggle`), ranking (`btn-rankings`), som (`btn-sound`) e menu (`btn-open-menu`).

### 5.2 Arena e mesa (`Basepedro/index.html:37-153`)

- `#poker-table`: mesa com feltro decorado (`felt-inner-ring`, marca d'água e blinds).
- `#deck-pile`: pilha visual de cartas (três camadas).
- `#dealer-btn`: botão do dealer.
- `.table-center`: pote (`#pot-amount`), side pots (`#side-pots-display`), 5 slots de cartas comunitárias (`.board-slot`) e banner da fase (`#phase-banner`).
- Assentos:
  - `#seat-0` (inferior): humano.
  - `#seat-1` (topo): CPU 1 (`1x1`) ou CPU Marcus (`4x1`).
  - `#seat-2` (direita): CPU Sofia (`4x1`).
  - `#seat-3` (esquerda): CPU Elena (`4x1`).
  - Cada assento tem cartas (`#cards-N`), nome, stack, bolha de ação e pill de aposta.
- `#fx-layer`: camada para fichas animadas.
- `#round-result-banner`: aviso de resultado da mão.

### 5.3 Drawer de histórico (`Basepedro/index.html:146-152`)

Painel lateral com lista `#action-log-list`, aberto/fechado pelo botão de histórico.

### 5.4 Rodapé de controles (`Basepedro/index.html:156-187`)

- `#live-status-text`: texto de status em tempo real.
- `#btn-action-help`: abre o guia "Passar vs Aumentar".
- `#action-controls-group`: grupo que fica `.disabled` quando não é sua vez.
- Presets de aposta (`btn-preset-min`, `btn-preset-half`, `btn-preset-pot`, `btn-preset-allin`).
- Slider `#bet-slider` e valor `#bet-slider-val`.
- Botões de ação: `#btn-fold`, `#btn-check-call`, `#btn-bet-raise`.

### 5.5 Menu inicial (`Basepedro/index.html:190-244`)

Overlay com:
- Seletor de idioma (`#lang-selector`).
- Seletor de modo (`#mode-selector`).
- Seletor de dificuldade (`#diff-selector`).
- `#btn-start-game` e `#btn-resume-game`.

### 5.6 Modais

| Modal | Linhas | Conteúdo |
|---|---|---|
| Ajuda de ações (`#help-overlay`) | 247-258 | Contexto ao vivo + grade de cartões gerada por JS |
| Ranking de mãos (`#rankings-overlay`) | 261-269 | Lista das 10 mãos, gerada por JS |
| Fim de jogo (`#gameover-overlay`) | 272-282 | Vitória/derrota + botões de reinício/menu |

---

## 6. `Basepedro/src/style.css` — aparência e animações

### 6.1 Variáveis globais (`style.css:5-19`)

```css
:root {
  --bg-dark: #090d10;
  --panel-bg: rgba(15, 23, 28, 0.92);
  --felt-center: #146c43;
  --felt-mid: #0d4f31;
  --felt-edge: #072e1c;
  --rail-wood: #2c1810;
  --rail-trim: #d4af37;
  --gold: #f5c542;
  --gold-soft: rgba(245, 197, 66, 0.25);
  --text-main: #f4f6f8;
  --text-muted: #9fb0bd;
  --red-suit: #d93025;
  --black-suit: #182026;
  --card-w: 64px;
  --card-h: 90px;
  --font-sans: 'Inter', ...;
}
```

Alterar essas variáveis muda rapidamente o tema, o tamanho das cartas e as cores dos naipes.

### 6.2 Seções do arquivo

| Linha | Seção | O que estiliza |
|---:|---|---|
| 42 | Top header | Barra superior, botões de ícone e badge de modo |
| 116 | Arena & table | Layout da mesa, feltro, marca d'água |
| 173 | Physical deck pile | Pilha de cartas decorativa |
| 202 | Dealer button | Botão `D` |
| 224 | Center board & pot | Pote, side pots, cartas comunitárias, banner de fase |
| 308 | Seats & players | Assentos, nomes, stacks, bolhas, pills de aposta, estados `folded`/`eliminated`/`active-turn` |
| 469 | 3D playing cards | Cartas com frente/verso, flip 3D, destaque de vencedoras e escurecimento das perdedoras |
| 600 | FX layer | Fichas voando |
| 620 | Round result banner | Banner de resultado da mão |
| 657 | Controls footer | Status ao vivo, slider, presets e botões de ação |
| 817 | Log drawer | Painel de histórico |
| 864 | Modals & main menu | Overlays, menu, botões segmentados, game over |
| 1029 | Rankings & help guide | Lista de ranking, cartões do guia e contexto ao vivo |
| 1164 | Responsive mobile | Ajustes para telas até 720 px |

### 6.3 Animações e técnicas

- **Cartas 3D:** `.poker-card` usa `perspective` e `.card-inner` gira com `rotateY` quando a classe `.face-up` é aplicada.
- **`@keyframes pulseThink`** (`style.css:436`): pulso da bolha "Pensando...".
- **`@keyframes popBanner`** (`style.css:640`): entrada do banner de resultado.
- **Fichas voando:** `.flying-chip` anima via `transform: translate3d(...)` com aceleração de GPU.
- **Interpolação numérica:** feita por JS (`animateNumber`), não por CSS.
- **Responsividade:** em telas pequenas, cartas diminuem (`--card-w: 48px`, `--card-h: 68px`), a mesa fica com 96vw × 56dvh, a pilha de cartas some e o guia vira uma coluna.
- **`user-select: none` e `touch-action`:** evitam seleção acidental e zoom/gestos durante o jogo.

---

## 7. Código original — detalhamento por bloco

> Os números de linha abaixo referem-se ao código original em `Basepedro/legacy/script.js`. Na versão modular, a lógica equivalente está em `Basepedro/src/game/`: `i18n.js`, `audio.js`, `engine.js`, `ai.js`, `ui.js` e `game.js`.

### 7.1 Internacionalização — `I18N` (`script.js:9-274`)

Objeto com duas chaves, `pt` e `en`. Cada idioma define:

- Textos do menu, botões, status, pote, ações e fases.
- Nomes e descrições das 10 mãos (`handNames`, `handDescs`).
- Mensagens de vitória, empate, fim de jogo e nova mão.
- Cartões do guia de ações (`guideCards`).

`applyLanguage()` (`script.js:696`) percorre os elementos por ID e aplica os textos. Também atualiza o badge de modo/dificuldade, o ranking, o guia e o nome do humano.

### 7.2 Motor de som — `SoundFX` (`script.js:277-366`)

Classe com `enabled` e um `AudioContext` criado sob demanda:

| Método | Efeito |
|---|---|
| `ensureCtx()` | Cria/retoma o contexto de áudio |
| `playCard()` | "Swoosh" curto ao distribuir carta |
| `playChip()` | Duas notas agudas ao apostar fichas |
| `playCheck()` | Som grave curto ao passar |
| `playWin()` | Arpejo de 4 notas ao vencer |

Tudo é sintetizado com osciladores e envelopes de ganho; não há arquivos de áudio.

### 7.3 Baralho e avaliação de mãos

**Constantes (`script.js:371-377`)**

```js
const SUITS = ['s', 'h', 'd', 'c'];
const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
const RANKS = [2, 3, ..., 14];
const RANK_LABELS = { ..., 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
```

**`createShuffledDeck()` (`script.js:379`)**
Cria 52 cartas (`{ rank, suit, id }`) e aplica Fisher-Yates.

**`evaluateFiveCards(cards)` (`script.js:394`)**
Avalia exatamente 5 cartas:

1. Ordena por rank decrescente.
2. Detecta flush (mesmo naipe em todas).
3. Detecta sequência, incluindo a roda `A-2-3-4-5` (valendo 5 como maior carta).
4. Conta frequências de ranks e monta grupos ordenados por quantidade e depois por rank.
5. Classifica em categoria e monta os "tiebreakers".

Categorias:

| Categoria | Mão |
|---:|---|
| 0 | Carta Alta |
| 1 | Um Par |
| 2 | Dois Pares |
| 3 | Trinca |
| 4 | Sequência |
| 5 | Flush |
| 6 | Full House |
| 7 | Quadra |
| 8 | Straight Flush |
| 9 | Royal Flush |

O score é calculado assim:

```js
let score = category * 1e10;
const multipliers = [1e8, 1e6, 1e4, 1e2, 1];
tiebreakers.forEach((v, i) => score += v * multipliers[i]);
```

Isso permite comparar mãos numericamente com um único número.

**`evaluateBestHand(cards)` (`script.js:466`)**
Se houver mais de 5 cartas (até 7), gera todas as combinações de 5 (`C(7,5) = 21`) e retorna a de maior `score`. Também devolve as cartas ordenadas da melhor mão.

### 7.4 Animações e cartas

- **`animateNumber(key, target, element, seatIndex)`** (`script.js:543`): interpola pot/stack com easing cúbico por 360 ms via `requestAnimationFrame`.
- **`spawnFlyingChips(fromEl, toEl, count)`** (`script.js:575`): cria fichas temporárias em `#fx-layer` e as move em `translate3d` com variação aleatória.
- **`createCardElement(card, faceUp)`** (`script.js:605`): monta o DOM da carta (frente, verso, cantos e naipe central), aplicando vermelho para copas/ouros e preto para espadas/paus.
- **`dealCardWithTrajectory(container, card, faceUp, delayMs)`** (`script.js:633`): espera o delay, cria a carta virada para baixo, anima do baralho até o destino e, se for o caso, vira a carta após 170 ms.

### 7.5 UI, idioma e modais

- **`renderHelpGuideModal()`** (`script.js:660`): atualiza o texto de contexto conforme sua situação (mesa livre ou aposta ativa) e renderiza os 6 cartões do guia (`Passar`, `Pagar`, `Apostar`, `Aumentar`, `Desistir`, `All-In`).
- **`applyLanguage()`** (`script.js:696`): aplica todos os textos conforme `state.lang`.
- **`renderRankingsModal()`** (`script.js:753`): monta a lista das 10 mãos com exemplos fixos.
- **`addLog(text, highlight)`** (`script.js:784`): adiciona entrada no topo, limita a 45 e re-renderiza a lista.
- **`updatePhaseBanner()`** (`script.js:796`): mostra `PRÉ-FLOP`, `FLOP`, `TURN`, `RIVER` ou `SHOWDOWN`.
- **`updatePlayerHandRankBadge()`** (`script.js:800`): calcula a melhor mão atual do humano e exibe o nome no badge.

### 7.6 Assentos e dealer

- **`moveDealerButtonToSeat(seatId)`** (`script.js:814`): posiciona o botão `D` ao lado do assento do dealer.
- **`syncTableSeatsUI()`** (`script.js:831`): para cada assento ativo, atualiza nome, stack animado, classes `folded`/`eliminated`/`active-turn`, pill de aposta e pote. Esconde assentos não usados no modo atual.
- **`setSeatBubble` / `clearAllBubbles`** (`script.js:860-869`): controlam as bolhas de ação ("Pensando...", "Pagou 20" etc.).

### 7.7 Início da partida — `startNewMatch()` (`script.js:872`)

1. Zera número de mãos, blinds, log e lista visual.
2. Cria os jogadores conforme o modo:
   - `1v1`: você + `CPU Viktor` no assento 1.
   - `4v1`: você + `CPU Elena` (3), `CPU Marcus` (1) e `CPU Sofia` (2).
3. Define dealer aleatório, ativa a partida e esconde o menu.
4. Aplica idioma, sincroniza a mesa e chama `startNextHand()`.

### 7.8 Ciclo da mão — `startNextHand()` (`script.js:934`)

1. Calcula jogadores vivos (`stack > 0`) e marca eliminados.
2. Se o humano foi eliminado ou só resta um jogador, chama `showGameOver()`.
3. Incrementa `handNumber`, limpa baralho, comunidade, pote, apostas, cartas e banners.
4. Avança o dealer para o próximo jogador ativo.
5. Define SB, BB e primeiro a agir:
   - **Heads-up:** dealer = SB; BB é o próximo; primeiro a agir no pré-flop é o SB.
   - **Multiway:** SB = próximo do dealer; BB = próximo do SB; primeiro a agir = próximo do BB.
6. Posta os blinds (`postBlind`, `script.js:1035`), que também movem fichas e tocam som.
7. Distribui 2 cartas por jogador, na ordem a partir do SB, com animação.
8. Define `turnIdx` e inicia `runTurnLoop()`.

**Helpers de ordem:**

- `getNextActivePlayerIdx()` (`script.js:907`): próximo não eliminado.
- `getNextActingPlayerIdx()` (`script.js:916`): próximo não eliminado, não folded e não all-in.
- `activeContenders()` (`script.js:926`): não eliminados e não folded.
- `playersAbleToAct()` (`script.js:930`): não eliminados, não folded e não all-in.

### 7.9 Rodada de apostas

**`isBettingRoundComplete()` (`script.js:1051`)**

A rodada termina quando:

- Há 1 ou 0 concorrentes ativos, ou
- Nenhum jogador pode agir (todos all-in), ou
- Todos que podem agir já agiram **e** igualaram `currentBet`.

**`runTurnLoop()` (`script.js:1061`)**

Laço principal:

1. Se resta 1 concorrente, resolve vitória sem showdown.
2. Se a rodada acabou, chama `advancePhase()`.
3. Se for o humano, ativa os controles e retorna (espera clique).
4. Se for CPU, mostra "Pensando...", espera 620/780/920 ms conforme dificuldade, calcula a decisão com `computeCpuDecision()` e aplica.
5. Avança o turno.

**`applyPlayerAction(player, type, raiseTarget)` (`script.js:1103`)**

Aplica `fold`, `check`, `call`, `bet` ou `raise`:

- **Fold:** marca `folded`, toca som, registra.
- **Check:** marca ação, registra.
- **Call:** paga `min(stack, toCall)`, podendo virar all-in.
- **Bet/Raise:** calcula o alvo final respeitando `currentBet + minRaise` e o stack; se o aumento for válido, atualiza `minRaise` e faz os outros jogadores precisarem agir de novo (`actedThisRound = false`).
- Sempre atualiza pote, apostas, stack, animações, log, bolha e side pots.

### 7.10 Progressão de fases — `advancePhase()` (`script.js:1173`)

1. Desativa controles, zera apostas da rodada e `currentBet`, restaura `minRaise`.
2. Conforme a fase:
   - **Pré-flop → Flop:** queima 1 carta e abre 3.
   - **Flop → Turn:** queima 1 e abre 1.
   - **Turn → River:** queima 1 e abre 1.
   - **River → Showdown:** chama `resolveShowdown()`.
3. Atualiza o badge da mão, limpa bolhas.
4. Se só um jogador (ou nenhum) pode agir, avança automaticamente após 550 ms (situação de all-in).
5. Caso contrário, o primeiro a agir no pós-flop é o próximo após o dealer e o loop recomeça.

### 7.11 Side pots — `calculateSidePots()` (`script.js:1229`)

Algoritmo:

1. Considera jogadores com `totalContributed > 0`.
2. Cria níveis únicos e ordenados de contribuição.
3. Para cada nível, calcula a "fatia" desde o nível anterior.
4. Soma a fatia de cada jogador que contribuiu pelo menos até aquele nível.
5. Elegíveis são apenas os jogadores **não folded** que atingiram o nível.
6. Cada nível vira um pote.

Exemplo:

| Jogador | Contribuição total | Situação |
|---|---:|---|
| A | 100 | all-in |
| B | 300 | ativo |
| C | 300 | ativo |

- Níveis: 100 e 300.
- **Pote principal:** 100 × 3 = 300; elegíveis A, B e C.
- **Side pot 1:** 200 × 2 = 400; elegíveis B e C.

`updateSidePotsBadge()` (`script.js:1252`) exibe os potes extras abaixo do pote principal quando há mais de um.

### 7.12 Resolução da mão

**Sem showdown — `resolveUncontestedWinner()` (`script.js:1266`)**
O único concorrente recebe todo o pote, há animação de fichas, banner e log; após 2,3 s começa a próxima mão.

**Showdown — `resolveShowdown()` (`script.js:1292`)**

1. Revela as cartas das CPUs.
2. Avalia todos os concorrentes com `evaluateBestHand` (2 cartas + 5 comunitárias).
3. Calcula os potes com `calculateSidePots()`.
4. Para cada pote, encontra o(s) maior(es) score(s) entre os elegíveis.
5. Divide o valor; sobras de 1 ficha vão para os primeiros vencedores da iteração.
6. Anima fichas do pote para os vencedores.
7. Destaca as 5 cartas vencedoras (`winner-highlight`) e escurece as demais (`dimmed-card`).
8. Mostra banner e log com o nome da mão.
9. Após 3,4 s, inicia a próxima mão.

### 7.13 Inteligência artificial

**`evaluatePreflopStrength(cards)` (`script.js:1402`)**

Pontua a mão inicial de 0 a 1:

- Rank médio das duas cartas.
- Bônus para par, naipes iguais, conectores e cartas altas (K/Q/J + 10+).

**`hasDrawPotential(cards)` (`script.js:1416`)**

Detecta projetos no flop/turn:

- 4 cartas do mesmo naipe (flush draw).
- 4 ranks dentro de uma janela de 4 (straight draw).

**`computeCpuDecision(cpu)` (`script.js:1429`)**

1. Calcula `toCall`, aposta máxima possível e aumento mínimo.
2. Mede força:
   - Pré-flop: `evaluatePreflopStrength`.
   - Pós-flop: `categoria × 0,16 + maior tiebreaker / 65`, com bônus de 0,14 se houver draw.
3. Calcula pot odds: `toCall / (pot + toCall)`.
4. Decide conforme a dificuldade:

| Dificuldade | Comportamento resumido |
|---|---|
| **Fácil** | Passa quase sempre sem aposta; aposta só com mão muito forte e com probabilidade baixa; desiste de mãos fracas diante de apostas caras; aumenta raramente. |
| **Médio** | Aposta com força > 0,52 ou draw; usa pot odds; aumenta com força > 0,72; desiste quando a força fica abaixo das pot odds. |
| **Difícil** | Bônus de posição para o dealer; aposta mais frequentemente; faz check-raise/re-raise com mãos fortes; blefa/semi-blefa com draws; usa fold disciplinado. |

Todas as decisões incluem aleatoriedade (`Math.random()`) para não serem determinísticas.

### 7.14 Controles do humano

- **`updateControlsUI()`** (`script.js:1501`): habilita/desabilita o grupo de ações; decide o rótulo de `Passar` ou `Pagar N`; calcula mínimo/máximo do slider; ajusta presets e o botão de aposta.
- **`syncRaiseButtonLabel(val)`** (`script.js:1545`): mostra `Apostar N`, `Aumentar p/ N` ou `All-In (N)`.
- **`handleHumanAction(type)`** (`script.js:1560`): consome a ação, aplica e devolve o controle ao loop.
- **`showGameOver(playerWon)`** (`script.js:1573`): abre o modal final com ícone, título e descrição.

### 7.15 Eventos — `bindEvents()` (`script.js:1585`)

Liga:

- Seletores de idioma/modo/dificuldade.
- Iniciar/continuar partida e abrir menu.
- Som, histórico, ajuda, ranking, game over.
- Slider, presets e botões de ação.
- Reposicionamento do dealer no `resize`.

No código original, `bindEvents()` e `applyLanguage()` são chamados uma vez. Na versão modular, `boot()` em `game.js` faz essas duas chamadas.

---

## 8. Fluxograma resumido de uma mão

```
startNewMatch()
  └─ startNextHand()
       ├─ limpa estado / rotaciona dealer
       ├─ posta blinds
       ├─ distribui 2 cartas
       └─ runTurnLoop()
            ├─ humano age (clique) ou CPU decide
            ├─ rodada completa? → advancePhase()
            │     ├─ flop (queima + 3)
            │     ├─ turn (queima + 1)
            │     ├─ river (queima + 1)
            │     └─ showdown → resolveShowdown()
            └─ só 1 ativo? → resolveUncontestedWinner()
                 └─ startNextHand() novamente
```

---

## 9. Diferenças entre as versões HTML (legado)

> Os três arquivos abaixo estão em `Basepedro/legacy/` e não fazem parte do build Vite.

### 9.1 `royal-texas-holdem-completo.html`

- CSS embutido (linhas 7-1197), HTML (1199-1473) e JS (1475-3181).
- Conteúdo equivalente a `index.html` + `style.css` + `script.js`.
- Útil para distribuir o jogo em um único arquivo.

### 9.2 `poker_texas_hold_em.html`

- CSS embutido (10-1299), HTML (1301-1635) e JS (1637-3351).
- Variante com interface anterior:
  - Rodapé com `#turn-status-pill` e `#turn-status-text` em vez de `#live-status-text`.
  - Botão `#btn-diff-help` com classes `diff-help-btn`/`help-q-badge`.
  - Modal de ajuda com cartões estáticos (`lbl-guide-check-title`, `lbl-guide-raise-title` etc.) e botão `#btn-help-got-it` ("Entendi!").
  - Chaves de tradução adicionais (`statusFreeCheck`, `statusFacingBet`, `contextIdle`, `contextWaiting`, `contextFreeCheck`, `contextFacingBet`, `eliminated`).
  - Função `updateTurnStatusAndHelpContext()` em vez de `renderHelpGuideModal()`.
- O núcleo (baralho, avaliador, fases, side pots, IA, sons) é equivalente; não é uma reescrita das regras.

### 9.3 `royal-texas-holdem-v2.zip`

- Pacote da versão antiga de arquivo separado.
- Contém `README.md` com a descrição do projeto.
- Os três arquivos de código são idênticos aos originais preservados em `Basepedro/legacy/`.

---

## 10. Personalização rápida

| O que mudar | Onde |
|---|---|
| Fichas iniciais | `Basepedro/src/game/game.js` (`startNewMatch`) e `engine.js` (`displayedValues`) |
| Small/big blind | `Basepedro/src/game/game.js` e `engine.js` (`state`) |
| Nomes das CPUs | `Basepedro/src/game/game.js` (`startNewMatch`) |
| Tempo de "pensamento" da CPU | `Basepedro/src/game/game.js` (`runTurnLoop`) |
| Comportamento da IA | `Basepedro/src/game/ai.js` + `engine.js` |
| Textos/idiomas | Objeto `I18N` em `Basepedro/src/game/i18n.js` |
| Quantidade de entradas do log | `Basepedro/src/game/ui.js` (`addLog`) |
| Duração das animações | `Basepedro/src/game/ui.js` (`animateNumber`, `dealCardWithTrajectory`) e `game.js` (espera entre mãos) |
| Cores e tamanhos das cartas | Variáveis em `Basepedro/src/style.css:5-19` |
| Ajustes mobile | `Basepedro/src/style.css` (seção responsiva) |
| Layout do HTML | `Basepedro/index.html` |
| Ordem/nomes dos assentos | `Basepedro/index.html` + `Basepedro/src/game/game.js` |
| Novos presets de aposta | `Basepedro/index.html` + `Basepedro/src/game/game.js` (`bindEvents`) |

### 10.1 Adicionar um idioma

1. Copie o bloco `pt` ou `en` em `I18N` (`Basepedro/src/game/i18n.js`).
2. Traduza as chaves e registre o novo código (ex.: `es`).
3. Adicione um botão em `#lang-selector` (`Basepedro/index.html`) com `data-lang="es"`.
4. Nenhuma alteração extra é necessária: `applyLanguage()` percorre o dicionário escolhido.

### 10.2 Ajustar a dificuldade

As decisões ficam em `computeCpuDecision` (`Basepedro/src/game/ai.js`). Para deixar a CPU mais agressiva, aumente as probabilidades (`rng < ...`) e reduza os limiares de força. Para deixá-la mais passiva, faça o contrário. A força pré-flop vem de `evaluatePreflopStrength` e a pós-flop de `evaluateBestHand`, ambas em `engine.js`.

---

## 11. Observações e limitações

- **Sem persistência:** não há `localStorage`; atualizar a página reinicia a partida. O botão "Continuar Partida Atual" só funciona enquanto a página permanece aberta.
- **Sem backend:** tudo roda no navegador; não há placar online, multijogador ou login.
- **Aleatoriedade:** usa `Math.random()`, adequado para um jogo casual, mas não para fins criptográficos ou competitivos.
- **Sobra de empate:** em split pot, a ficha ímpar vai para o primeiro vencedor na ordem de iteração, não pela regra oficial de posição.
- **Sem rebuy:** quando um jogador zera, é eliminado.
- **Som:** depende de interação do usuário e da Web Audio API; pode não funcionar em navegadores muito antigos.
- **`user-select: none` e viewport sem zoom:** escolhas de UX para mobile, mas podem incomodar quem tenta copiar texto.
- **Acessibilidade:** há títulos e `title` em botões, mas não há suporte completo a leitores de tela nem navegação por teclado.
- **Versões autônomas:** se você editar a versão separada, as versões embutidas não são atualizadas automaticamente; é preciso regerá-las ou redistribuir.

---

## 12. Glossário rápido

| Termo | Significado |
|---|---|
| **Stack** | Fichas disponíveis do jogador |
| **Blind** | Aposta forçada inicial (SB = small blind, BB = big blind) |
| **Dealer / Button** | Posição que gira a cada mão |
| **Pré-flop** | Antes das cartas comunitárias |
| **Flop / Turn / River** | 3, 4 e 5 cartas comunitárias |
| **Check** | Passar sem apostar (quando não há aposta) |
| **Call** | Pagar a aposta corrente |
| **Bet** | Abrir aposta |
| **Raise** | Aumentar a aposta |
| **Fold** | Desistir da mão |
| **All-in** | Apostar todas as fichas |
| **Side pot** | Pote paralelo para apostas acima do all-in de outro jogador |
| **Showdown** | Revelação e comparação das mãos |
| **Kicker** | Carta de desempate |
| **Pot odds** | Relação entre o custo de pagar e o tamanho do pote |

---

## 13. Referência rápida de funções (código original)

> Linhas de `Basepedro/legacy/script.js`. Na versão modular, consulte os arquivos indicados na seção 4.

| Linha | Função | Responsabilidade |
|---:|---|---|
| 277 | `SoundFX` | Efeitos sonoros |
| 379 | `createShuffledDeck` | Cria e embaralha 52 cartas |
| 394 | `evaluateFiveCards` | Avalia 5 cartas |
| 466 | `evaluateBestHand` | Melhor mão entre 5-7 cartas |
| 543 | `animateNumber` | Interpolação visual de valores |
| 575 | `spawnFlyingChips` | Animação de fichas |
| 605 | `createCardElement` | DOM de uma carta |
| 633 | `dealCardWithTrajectory` | Distribuição animada |
| 660 | `renderHelpGuideModal` | Guia de ações |
| 696 | `applyLanguage` | Tradução da interface |
| 753 | `renderRankingsModal` | Ranking de mãos |
| 784 | `addLog` | Histórico |
| 796 | `updatePhaseBanner` | Banner de fase |
| 800 | `updatePlayerHandRankBadge` | Mão atual do humano |
| 814 | `moveDealerButtonToSeat` | Posição do dealer |
| 831 | `syncTableSeatsUI` | Sincroniza assentos |
| 872 | `startNewMatch` | Inicia partida |
| 907 | `getNextActivePlayerIdx` | Próximo jogador ativo |
| 916 | `getNextActingPlayerIdx` | Próximo jogador que pode agir |
| 934 | `startNextHand` | Inicia mão |
| 1035 | `postBlind` | Posta blind |
| 1051 | `isBettingRoundComplete` | Fim da rodada |
| 1061 | `runTurnLoop` | Loop de turnos |
| 1103 | `applyPlayerAction` | Aplica ação |
| 1173 | `advancePhase` | Avança fase |
| 1229 | `calculateSidePots` | Calcula side pots |
| 1252 | `updateSidePotsBadge` | Exibe side pots |
| 1266 | `resolveUncontestedWinner` | Vitória sem showdown |
| 1292 | `resolveShowdown` | Resolve showdown |
| 1402 | `evaluatePreflopStrength` | Força pré-flop da CPU |
| 1416 | `hasDrawPotential` | Detecta draws |
| 1429 | `computeCpuDecision` | Decisão da CPU |
| 1501 | `updateControlsUI` | Controles do humano |
| 1545 | `syncRaiseButtonLabel` | Rótulo de aposta |
| 1560 | `handleHumanAction` | Ação do humano |
| 1573 | `showGameOver` | Modal final |
| 1585 | `bindEvents` | Eventos |

---

## 14. Referência rápida de IDs do HTML

| ID | Função |
|---|---|
| `menu-overlay` | Menu inicial |
| `btn-start-game` | Iniciar partida |
| `btn-resume-game` | Continuar partida |
| `lang-selector` | Seleção de idioma |
| `mode-selector` | Seleção de modo |
| `diff-selector` | Seleção de dificuldade |
| `poker-table` | Mesa |
| `pot-amount` | Valor do pote |
| `side-pots-display` | Side pots |
| `community-cards` | Container das comunitárias |
| `phase-banner` | Fase atual |
| `seat-0` … `seat-3` | Assentos |
| `cards-N` | Cartas do assento N |
| `stack-N` | Stack do assento N |
| `bubble-N` | Bolha de ação |
| `bet-N` | Pill de aposta |
| `dealer-btn` | Botão do dealer |
| `fx-layer` | Camada de animação |
| `round-result-banner` | Resultado da mão |
| `log-drawer` | Histórico |
| `action-log-list` | Lista do histórico |
| `live-status-text` | Status ao vivo |
| `action-controls-group` | Grupo de ações |
| `bet-slider` | Slider de aposta |
| `bet-slider-val` | Valor do slider |
| `btn-fold` | Desistir |
| `btn-check-call` | Passar/Pagar |
| `btn-bet-raise` | Apostar/Aumentar |
| `btn-action-help` | Guia de ações |
| `help-overlay` | Modal de ajuda |
| `rankings-overlay` | Modal de ranking |
| `gameover-overlay` | Modal de fim de jogo |
| `sound-icon` | Ícone de som |

---

## 15. Conclusão

A pasta `Basepedro` entrega um Texas Hold'em completo e autossuficiente, agora estruturado como projeto Node/Vite sem TypeScript e publicado como site estático. O código-fonte fica em `Basepedro/src/`, o build em `dist/` e os arquivos originais em `Basepedro/legacy/`. O jogo mantém estado centralizado, motor de regras próprio, IA heurística, side pots e uma camada visual rica em animações.
