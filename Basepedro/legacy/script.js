/* =========================================================
   ROYAL TEXAS HOLD'EM - GAME ENGINE, AI, SIDE POTS & FX
   ========================================================= */

(() => {
  'use strict';

  // ---------------- INTERNATIONALIZATION (PT / EN) ----------------
  const I18N = {
    pt: {
      menuTitle: "ROYAL TEXAS HOLD'EM",
      menuSubtitle: "Configure sua mesa e escolha seus oponentes",
      selectLang: "Idioma / Language",
      selectMode: "Tipo de Jogo",
      mode1v1Desc: "Duelo Direto (Heads-Up)",
      mode4v1Desc: "Você vs 3 CPUs",
      selectDiff: "Dificuldade da CPU",
      diffEasy: "Fácil",
      diffEasySub: "Casual",
      diffMed: "Médio",
      diffMedSub: "Tático",
      diffHard: "Difícil",
      diffHardSub: "Agressivo",
      startGame: "Iniciar Partida",
      resumeGame: "Continuar Partida Atual",
      logBtn: "Histórico",
      rankingsBtn: "Ranking",
      menuBtn: "Menu",
      logTitle: "Histórico da Mesa",
      rankingsTitle: "Ranking de Mãos (Maior para Menor)",
      helpDiffBtn: "Passar vs Aumentar",
      helpModalTitle: "Diferença entre Passar, Pagar e Aumentar",
      statusIdle: "Escolha o modo de jogo no menu para iniciar.",
      statusWaitingCpu: "⏳ Aguardando jogada dos oponentes...",
      statusFreeTable: "🟢 Mesa livre (0 fichas): você pode Passar de graça ou Apostar para abrir.",
      statusActiveBet: "🟡 Aposta ativa ({bet}): pague {call} para continuar ou Aumente a partir de {minRaise}.",
      helpContextFree: "📌 Situação agora: Ninguém apostou nesta rodada. O botão Passar (Check) está liberado por 0 fichas, ou você pode Apostar (Bet) para colocar pressão.",
      helpContextBet: "📌 Situação agora: Há uma aposta de {bet} fichas na mesa. Por isso o Passar virou Pagar {call} (Call) — e se quiser subir o valor, use Aumentar (Raise).",
      helpContextIdle: "📌 Dica rápida: Passar (Check) não custa nada e só aparece quando ninguém apostou na rodada; Aumentar (Raise) cobre a aposta da mesa e coloca fichas extras.",
      guideCards: [
        {
          title: "Passar (Check)",
          cost: "0 fichas",
          accent: "blue-accent",
          desc: "Só aparece quando ninguém apostou naquela rodada. Você continua na mão de graça e passa a vez."
        },
        {
          title: "Pagar (Call)",
          cost: "Iguala aposta",
          accent: "blue-accent",
          desc: "Substitui o Passar quando um oponente já apostou. Você cobre exatamente o valor atual para ver a próxima carta."
        },
        {
          title: "Apostar (Bet)",
          cost: "Abre a rodada",
          accent: "amber-accent",
          desc: "Usado quando a mesa ainda está em 0 fichas. Você define a primeira aposta daquela fase e obriga os rivais a pagarem."
        },
        {
          title: "Aumentar (Raise)",
          cost: "Cobre + sobe",
          accent: "amber-accent",
          desc: "Usado quando já existe aposta na mesa. Você iguala o valor atual e adiciona fichas a mais, forçando os outros a pagarem mais caro."
        },
        {
          title: "Desistir (Fold)",
          cost: "Encerra mão",
          accent: "red-accent",
          desc: "Você entrega suas cartas e sai da rodada atual sem gastar mais fichas, preservando seu saldo restante."
        },
        {
          title: "All-In",
          cost: "Todas fichas",
          accent: "emerald-accent",
          desc: "Aposta todo o seu saldo de uma vez. Se outro jogador tiver mais fichas, cria-se um Pote Paralelo (Side Pot)."
        }
      ],
      pot: "POTE",
      sidePot: "Pote Paralelo",
      mainPot: "Pote Principal",
      you: "Você",
      fold: "Desistir",
      check: "Passar",
      call: "Pagar",
      bet: "Apostar",
      raiseTo: "Aumentar p/",
      min: "Mín",
      halfPot: "1/2 Pote",
      fullPot: "Pote",
      allIn: "All-In",
      thinking: "Pensando...",
      phases: {
        preflop: "PRÉ-FLOP",
        flop: "FLOP",
        turn: "TURN",
        river: "RIVER",
        showdown: "SHOWDOWN"
      },
      actions: {
        fold: "Desistiu",
        check: "Passou",
        call: "Pagou",
        bet: "Apostou",
        raise: "Aumentou",
        allin: "All-In!"
      },
      handNames: [
        "Carta Alta",
        "Um Par",
        "Dois Pares",
        "Trinca",
        "Sequência",
        "Flush",
        "Full House",
        "Quadra",
        "Straight Flush",
        "Royal Flush"
      ],
      handDescs: [
        "Nenhuma combinação formada; vale a carta mais alta.",
        "Duas cartas do mesmo valor.",
        "Dois pares distintos de cartas.",
        "Três cartas do mesmo valor.",
        "Cinco cartas em sequência numérica de naipes variados.",
        "Cinco cartas do mesmo naipe, fora de sequência.",
        "Uma trinca combinada com um par.",
        "Quatro cartas do mesmo valor.",
        "Cinco cartas em sequência do mesmo naipe.",
        "A, K, Q, J, 10 do mesmo naipe."
      ],
      winUncontested: "{name} venceu +{amount} fichas (todos desistiram)",
      winShowdown: "{name} venceu +{amount} fichas",
      splitPot: "Empate! {names} dividem +{amount} fichas",
      gameOverWinTitle: "Campeão da Mesa!",
      gameOverWinDesc: "Você eliminou todos os oponentes e conquistou todas as fichas.",
      gameOverLoseTitle: "Fim de Jogo",
      gameOverLoseDesc: "Suas fichas acabaram. Tente uma nova estratégia!",
      playAgain: "Jogar Novamente",
      backToMenu: "Voltar ao Menu",
      newHandLog: "--- Nova Mão #{num} (Dealer: {dealer}) ---"
    },
    en: {
      menuTitle: "ROYAL TEXAS HOLD'EM",
      menuSubtitle: "Configure your table and choose your opponents",
      selectLang: "Language / Idioma",
      selectMode: "Game Mode",
      mode1v1Desc: "Heads-Up Duel",
      mode4v1Desc: "You vs 3 CPUs",
      selectDiff: "CPU Difficulty",
      diffEasy: "Easy",
      diffEasySub: "Casual",
      diffMed: "Medium",
      diffMedSub: "Tactical",
      diffHard: "Hard",
      diffHardSub: "Aggressive",
      startGame: "Start Match",
      resumeGame: "Resume Current Match",
      logBtn: "History",
      rankingsBtn: "Rankings",
      menuBtn: "Menu",
      logTitle: "Table Action Log",
      rankingsTitle: "Poker Hand Rankings (Highest to Lowest)",
      helpDiffBtn: "Check vs Raise",
      helpModalTitle: "Difference Between Check, Call & Raise",
      statusIdle: "Choose your table setup in the menu to start.",
      statusWaitingCpu: "⏳ Waiting for opponents to act...",
      statusFreeTable: "🟢 Open table (0 chips): you can Check for free or Bet to open.",
      statusActiveBet: "🟡 Active bet ({bet}): call {call} to stay in or Raise from {minRaise}.",
      helpContextFree: "📌 Current situation: Nobody has bet yet this round. Check is free (0 chips), or you can Bet to put pressure on opponents.",
      helpContextBet: "📌 Current situation: There is an active bet of {bet} chips. Check becomes Call {call} to match it — or use Raise to increase the stakes.",
      helpContextIdle: "📌 Quick tip: Check costs 0 chips and is only available when no bet is active; Raise matches the current bet and adds extra chips on top.",
      guideCards: [
        {
          title: "Check",
          cost: "0 chips",
          accent: "blue-accent",
          desc: "Only available when nobody has bet in the current round. You stay in the hand for free and pass the turn."
        },
        {
          title: "Call",
          cost: "Matches bet",
          accent: "blue-accent",
          desc: "Replaces Check when an opponent has already bet. You match the exact current bet to stay in the hand."
        },
        {
          title: "Bet",
          cost: "Opens action",
          accent: "amber-accent",
          desc: "Used when the table is still at 0 chips. You set the first wager of the street, forcing rivals to call or fold."
        },
        {
          title: "Raise",
          cost: "Match + more",
          accent: "amber-accent",
          desc: "Used when a bet already exists. You match the active wager and add extra chips on top to raise the price."
        },
        {
          title: "Fold",
          cost: "Exit hand",
          accent: "red-accent",
          desc: "Discard your hand and forfeit the current pot without risking any additional chips."
        },
        {
          title: "All-In",
          cost: "Entire stack",
          accent: "emerald-accent",
          desc: "Wager all of your remaining chips at once. If another player has more chips, a Side Pot is created."
        }
      ],
      pot: "POT",
      sidePot: "Side Pot",
      mainPot: "Main Pot",
      you: "You",
      fold: "Fold",
      check: "Check",
      call: "Call",
      bet: "Bet",
      raiseTo: "Raise to",
      min: "Min",
      halfPot: "1/2 Pot",
      fullPot: "Pot",
      allIn: "All-In",
      thinking: "Thinking...",
      phases: {
        preflop: "PRE-FLOP",
        flop: "FLOP",
        turn: "TURN",
        river: "RIVER",
        showdown: "SHOWDOWN"
      },
      actions: {
        fold: "Folded",
        check: "Checked",
        call: "Called",
        bet: "Bet",
        raise: "Raised",
        allin: "All-In!"
      },
      handNames: [
        "High Card",
        "One Pair",
        "Two Pair",
        "Three of a Kind",
        "Straight",
        "Flush",
        "Full House",
        "Four of a Kind",
        "Straight Flush",
        "Royal Flush"
      ],
      handDescs: [
        "No matching combination; highest card plays.",
        "Two cards of the same rank.",
        "Two distinct pairs of cards.",
        "Three cards of the same rank.",
        "Five consecutive cards of mixed suits.",
        "Five cards of the same suit, not in sequence.",
        "Three of a kind combined with a pair.",
        "Four cards of the same rank.",
        "Five consecutive cards of the same suit.",
        "A, K, Q, J, 10 all of the same suit."
      ],
      winUncontested: "{name} won +{amount} chips (everyone folded)",
      winShowdown: "{name} won +{amount} chips",
      splitPot: "Split Pot! {names} split +{amount} chips",
      gameOverWinTitle: "Table Champion!",
      gameOverWinDesc: "You busted every opponent and claimed all the chips.",
      gameOverLoseTitle: "Game Over",
      gameOverLoseDesc: "You ran out of chips. Try a fresh strategy!",
      playAgain: "Play Again",
      backToMenu: "Back to Menu",
      newHandLog: "--- Hand #{num} (Dealer: {dealer}) ---"
    }
  };

  // ---------------- SOUND ENGINE (WEB AUDIO SYNTH) ----------------
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    ensureCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playCard() {
      if (!this.enabled) return;
      this.ensureCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.065);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    }

    playChip() {
      if (!this.enabled) return;
      this.ensureCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [1450, 2150].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);
        gain.gain.setValueAtTime(0.06, now + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.025 + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.09);
      });
    }

    playCheck() {
      if (!this.enabled) return;
      this.ensureCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.06);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }

    playWin() {
      if (!this.enabled) return;
      this.ensureCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    }
  }

  const sfx = new SoundFX();

  // ---------------- CARD & DECK UTILITIES ----------------
  const SUITS = ['s', 'h', 'd', 'c'];
  const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
  const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const RANK_LABELS = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
    10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A'
  };

  function createShuffledDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ rank, suit, id: `${rank}${suit}` });
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // ---------------- 7-CARD POKER HAND EVALUATOR ----------------
  function evaluateFiveCards(cards) {
    const sorted = [...cards].sort((a, b) => b.rank - a.rank);
    const ranks = sorted.map(c => c.rank);
    const isFlush = sorted.every(c => c.suit === sorted[0].suit);

    let isStraight = false;
    let straightHigh = 0;
    const uniqueRanks = [...new Set(ranks)];
    if (uniqueRanks.length === 5) {
      if (uniqueRanks[0] - uniqueRanks[4] === 4) {
        isStraight = true;
        straightHigh = uniqueRanks[0];
      } else if (
        uniqueRanks[0] === 14 &&
        uniqueRanks[1] === 5 &&
        uniqueRanks[2] === 4 &&
        uniqueRanks[3] === 3 &&
        uniqueRanks[4] === 2
      ) {
        isStraight = true;
        straightHigh = 5;
      }
    }

    const counts = new Map();
    for (const r of ranks) counts.set(r, (counts.get(r) || 0) + 1);
    const groups = [...counts.entries()].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0] - a[0];
    });

    let category = 0;
    let tiebreakers = [];

    if (isStraight && isFlush) {
      category = straightHigh === 14 ? 9 : 8;
      tiebreakers = [straightHigh];
    } else if (groups[0][1] === 4) {
      category = 7;
      tiebreakers = [groups[0][0], groups[1][0]];
    } else if (groups[0][1] === 3 && groups[1][1] === 2) {
      category = 6;
      tiebreakers = [groups[0][0], groups[1][0]];
    } else if (isFlush) {
      category = 5;
      tiebreakers = ranks;
    } else if (isStraight) {
      category = 4;
      tiebreakers = [straightHigh];
    } else if (groups[0][1] === 3) {
      category = 3;
      tiebreakers = [groups[0][0], groups[1][0], groups[2][0]];
    } else if (groups[0][1] === 2 && groups[1][1] === 2) {
      category = 2;
      tiebreakers = [groups[0][0], groups[1][0], groups[2][0]];
    } else if (groups[0][1] === 2) {
      category = 1;
      tiebreakers = [groups[0][0], groups[1][0], groups[2][0], groups[3][0]];
    } else {
      category = 0;
      tiebreakers = ranks;
    }

    let score = category * 1e10;
    const multipliers = [1e8, 1e6, 1e4, 1e2, 1];
    for (let i = 0; i < tiebreakers.length; i++) {
      score += tiebreakers[i] * multipliers[i];
    }

    return { category, tiebreakers, score, cards: sorted };
  }

  function evaluateBestHand(cards) {
    if (!cards || cards.length === 0) return null;
    if (cards.length <= 5) return evaluateFiveCards(cards);

    let best = null;
    const n = cards.length;
    for (let a = 0; a < n - 4; a++) {
      for (let b = a + 1; b < n - 3; b++) {
        for (let c = b + 1; c < n - 2; c++) {
          for (let d = c + 1; d < n - 1; d++) {
            for (let e = d + 1; e < n; e++) {
              const res = evaluateFiveCards([cards[a], cards[b], cards[c], cards[d], cards[e]]);
              if (!best || res.score > best.score) best = res;
            }
          }
        }
      }
    }
    return best;
  }

  // ---------------- GAME STATE ----------------
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

  // ---------------- DOM CACHE ----------------
  const dom = {
    menuOverlay: document.getElementById('menu-overlay'),
    helpOverlay: document.getElementById('help-overlay'),
    rankingsOverlay: document.getElementById('rankings-overlay'),
    gameoverOverlay: document.getElementById('gameover-overlay'),
    logDrawer: document.getElementById('log-drawer'),
    actionLogList: document.getElementById('action-log-list'),
    tableModeBadge: document.getElementById('table-mode-badge'),
    deckPile: document.getElementById('deck-pile'),
    dealerBtn: document.getElementById('dealer-btn'),
    potAmount: document.getElementById('pot-amount'),
    sidePotsDisplay: document.getElementById('side-pots-display'),
    phaseBanner: document.getElementById('phase-banner'),
    playerHandRank: document.getElementById('player-hand-rank'),
    fxLayer: document.getElementById('fx-layer'),
    resultBanner: document.getElementById('round-result-banner'),
    resultTitle: document.getElementById('round-result-title'),
    resultDetail: document.getElementById('round-result-detail'),
    liveStatusText: document.getElementById('live-status-text'),
    actionControlsGroup: document.getElementById('action-controls-group'),
    betSlider: document.getElementById('bet-slider'),
    betSliderVal: document.getElementById('bet-slider-val'),
    btnFold: document.getElementById('btn-fold'),
    btnCheckCall: document.getElementById('btn-check-call'),
    btnBetRaise: document.getElementById('btn-bet-raise'),
    btnResumeGame: document.getElementById('btn-resume-game')
  };

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // ---------------- SMOOTH NUMBER ANIMATION (60FPS) ----------------
  function animateNumber(key, target, element, seatIndex = null) {
    const startVal = seatIndex === null
      ? state.displayedValues.pot
      : state.displayedValues.stacks[seatIndex];

    if (startVal === target) {
      element.textContent = target.toLocaleString(state.lang === 'pt' ? 'pt-BR' : 'en-US');
      return;
    }

    const duration = 360;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);

      if (seatIndex === null) {
        state.displayedValues.pot = current;
      } else {
        state.displayedValues.stacks[seatIndex] = current;
      }

      element.textContent = current.toLocaleString(state.lang === 'pt' ? 'pt-BR' : 'en-US');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------------- FLYING CHIP ANIMATION ----------------
  function spawnFlyingChips(fromEl, toEl, count = 3) {
    if (!fromEl || !toEl) return;
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 - 11;
    const startY = fromRect.top + fromRect.height / 2 - 11;
    const endX = toRect.left + toRect.width / 2 - 11;
    const endY = toRect.top + toRect.height / 2 - 11;

    for (let i = 0; i < count; i++) {
      const chip = document.createElement('div');
      chip.className = 'flying-chip';
      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 16;
      chip.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(0.8)`;
      dom.fxLayer.appendChild(chip);

      setTimeout(() => {
        chip.style.transform = `translate3d(${endX + offsetX}px, ${endY + offsetY}px, 0) scale(1)`;
      }, 20 + i * 55);

      setTimeout(() => {
        chip.style.opacity = '0';
        setTimeout(() => chip.remove(), 220);
      }, 520 + i * 55);
    }
  }

  // ---------------- CARD DOM & DEAL TRAJECTORY ----------------
  function createCardElement(card, faceUp = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `poker-card${faceUp ? ' face-up' : ''}`;
    cardEl.dataset.cardId = card.id;

    const isRed = card.suit === 'h' || card.suit === 'd';
    const rankStr = RANK_LABELS[card.rank];
    const suitStr = SUIT_SYMBOLS[card.suit];

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front ${isRed ? 'red' : 'black'}">
          <div class="card-corner">
            <span>${rankStr}</span>
            <span>${suitStr}</span>
          </div>
          <div class="card-center-suit">${suitStr}</div>
          <div class="card-corner bottom">
            <span>${rankStr}</span>
            <span>${suitStr}</span>
          </div>
        </div>
      </div>
    `;
    return cardEl;
  }

  async function dealCardWithTrajectory(container, card, faceUp, delayMs = 0) {
    await sleep(delayMs);
    const cardEl = createCardElement(card, false);
    container.appendChild(cardEl);
    sfx.playCard();

    const deckRect = dom.deckPile.getBoundingClientRect();
    const targetRect = cardEl.getBoundingClientRect();

    if (deckRect.width > 0 && targetRect.width > 0) {
      const dx = deckRect.left + deckRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = deckRect.top + deckRect.height / 2 - (targetRect.top + targetRect.height / 2);
      cardEl.style.transition = 'none';
      cardEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.65) rotate(-14deg)`;
      cardEl.getBoundingClientRect();
      cardEl.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
      cardEl.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
    }

    if (faceUp) {
      await sleep(170);
      cardEl.classList.add('face-up');
    }
    return cardEl;
  }

  // ---------------- TRANSLATION & HELP GUIDE RENDERING ----------------
  function renderHelpGuideModal() {
    const dict = I18N[state.lang];
    document.getElementById('lbl-help-modal-title').textContent = dict.helpModalTitle;

    const contextBox = document.getElementById('help-live-context');
    const human = state.players[0];
    if (human && state.waitingForHuman) {
      const toCall = Math.max(0, state.currentBet - human.bet);
      if (toCall === 0) {
        contextBox.textContent = dict.helpContextFree;
      } else {
        const pay = Math.min(human.stack, toCall);
        contextBox.textContent = dict.helpContextBet
          .replace('{bet}', state.currentBet)
          .replace('{call}', pay);
      }
    } else {
      contextBox.textContent = dict.helpContextIdle;
    }

    const grid = document.getElementById('help-guide-grid');
    grid.innerHTML = '';
    for (const item of dict.guideCards) {
      const card = document.createElement('div');
      card.className = `guide-card ${item.accent}`;
      card.innerHTML = `
        <div class="guide-card-head">
          <strong>${item.title}</strong>
          <span class="cost-pill">${item.cost}</span>
        </div>
        <p>${item.desc}</p>
      `;
      grid.appendChild(card);
    }
  }

  function applyLanguage() {
    const dict = I18N[state.lang];
    document.getElementById('menu-title').textContent = dict.menuTitle;
    document.getElementById('menu-subtitle').textContent = dict.menuSubtitle;
    document.getElementById('lbl-select-lang').textContent = dict.selectLang;
    document.getElementById('lbl-select-mode').textContent = dict.selectMode;
    document.getElementById('lbl-mode-1v1-desc').textContent = dict.mode1v1Desc;
    document.getElementById('lbl-mode-4v1-desc').textContent = dict.mode4v1Desc;
    document.getElementById('lbl-select-diff').textContent = dict.selectDiff;
    document.getElementById('lbl-diff-easy').textContent = dict.diffEasy;
    document.getElementById('lbl-diff-easy-sub').textContent = dict.diffEasySub;
    document.getElementById('lbl-diff-med').textContent = dict.diffMed;
    document.getElementById('lbl-diff-med-sub').textContent = dict.diffMedSub;
    document.getElementById('lbl-diff-hard').textContent = dict.diffHard;
    document.getElementById('lbl-diff-hard-sub').textContent = dict.diffHardSub;
    document.getElementById('btn-start-game').textContent = dict.startGame;
    document.getElementById('btn-resume-game').textContent = dict.resumeGame;
    document.getElementById('lbl-log-btn').textContent = dict.logBtn;
    document.getElementById('lbl-rankings-btn').textContent = dict.rankingsBtn;
    document.getElementById('lbl-menu-btn').textContent = dict.menuBtn;
    document.getElementById('lbl-log-title').textContent = dict.logTitle;
    document.getElementById('lbl-rankings-title').textContent = dict.rankingsTitle;
    document.getElementById('lbl-help-diff-btn').textContent = dict.helpDiffBtn;
    document.getElementById('lbl-pot').textContent = dict.pot;
    document.getElementById('btn-preset-min').textContent = dict.min;
    document.getElementById('btn-preset-half').textContent = dict.halfPot;
    document.getElementById('btn-preset-pot').textContent = dict.fullPot;
    document.getElementById('btn-preset-allin').textContent = dict.allIn;
    document.getElementById('btn-fold').textContent = dict.fold;
    document.getElementById('btn-play-again').textContent = dict.playAgain;
    document.getElementById('btn-gameover-menu').textContent = dict.backToMenu;

    const diffLabel = state.difficulty === 'easy'
      ? dict.diffEasy
      : state.difficulty === 'medium'
        ? dict.diffMed
        : dict.diffHard;
    dom.tableModeBadge.textContent = `${state.mode.toUpperCase()} • ${diffLabel.toUpperCase()}`;

    if (state.players.length > 0) {
      state.players[0].name = dict.you;
      document.getElementById('name-0').textContent = dict.you;
      updatePlayerHandRankBadge();
      updatePhaseBanner();
      if (state.waitingForHuman) {
        updateControlsUI();
      } else {
        dom.liveStatusText.textContent = dict.statusWaitingCpu;
      }
    } else {
      dom.liveStatusText.textContent = dict.statusIdle;
    }

    renderRankingsModal();
    renderHelpGuideModal();
  }

  function renderRankingsModal() {
    const dict = I18N[state.lang];
    const examples = [
      'A♠ K♠ Q♠ J♠ 10♠',
      '9♥ 8♥ 7♥ 6♥ 5♥',
      'K♠ K♥ K♦ K♣ 7♠',
      'Q♠ Q♥ Q♦ 9♣ 9♠',
      'A♦ J♦ 8♦ 5♦ 2♦',
      '10♠ 9♥ 8♣ 7♦ 6♠',
      '7♠ 7♥ 7♦ K♣ 4♠',
      'J♠ J♥ 4♦ 4♣ A♠',
      'A♠ A♥ K♦ 9♣ 5♠',
      'A♠ Q♥ 9♦ 6♣ 3♠'
    ];
    const listEl = document.getElementById('rankings-list');
    listEl.innerHTML = '';
    for (let i = 9; i >= 0; i--) {
      const idx = 9 - i;
      const row = document.createElement('div');
      row.className = 'ranking-row';
      row.innerHTML = `
        <div class="ranking-info">
          <strong>${idx + 1}. ${dict.handNames[i]}</strong>
          <span>${dict.handDescs[i]}</span>
        </div>
        <div class="ranking-example">${examples[idx]}</div>
      `;
      listEl.appendChild(row);
    }
  }

  function addLog(text, highlight = false) {
    state.logEntries.unshift({ text, highlight });
    if (state.logEntries.length > 45) state.logEntries.pop();
    dom.actionLogList.innerHTML = '';
    for (const item of state.logEntries) {
      const li = document.createElement('li');
      li.textContent = item.text;
      if (item.highlight) li.classList.add('highlight');
      dom.actionLogList.appendChild(li);
    }
  }

  function updatePhaseBanner() {
    dom.phaseBanner.textContent = I18N[state.lang].phases[state.phase] || '';
  }

  function updatePlayerHandRankBadge() {
    const human = state.players[0];
    if (!human || human.folded || human.cards.length === 0) {
      dom.playerHandRank.textContent = '—';
      return;
    }
    const evalRes = evaluateBestHand([...human.cards, ...state.community]);
    if (!evalRes) {
      dom.playerHandRank.textContent = '—';
      return;
    }
    dom.playerHandRank.textContent = I18N[state.lang].handNames[evalRes.category];
  }

  function moveDealerButtonToSeat(seatId) {
    const seatEl = document.getElementById(`seat-${seatId}`);
    const tableEl = document.getElementById('poker-table');
    if (!seatEl || !tableEl) return;
    const tableRect = tableEl.getBoundingClientRect();
    const seatRect = seatEl.getBoundingClientRect();

    let offsetX = seatRect.left - tableRect.left + seatRect.width - 18;
    let offsetY = seatRect.top - tableRect.top + 8;

    if (seatId === 0) {
      offsetX = seatRect.left - tableRect.left + seatRect.width - 16;
      offsetY = seatRect.top - tableRect.top + 28;
    }
    dom.dealerBtn.style.transform = `translate3d(${Math.round(offsetX)}px, ${Math.round(offsetY)}px, 0)`;
  }

  function syncTableSeatsUI() {
    const activeIds = new Set(state.players.map(p => p.seatId));
    [0, 1, 2, 3].forEach(seatId => {
      const seatEl = document.getElementById(`seat-${seatId}`);
      if (!activeIds.has(seatId)) {
        seatEl.classList.add('hidden-seat');
        return;
      }
      seatEl.classList.remove('hidden-seat');
      const p = state.players.find(pl => pl.seatId === seatId);
      document.getElementById(`name-${seatId}`).textContent = p.name;
      animateNumber('stack', p.stack, document.getElementById(`stack-${seatId}`), seatId);

      seatEl.classList.toggle('folded', p.folded);
      seatEl.classList.toggle('eliminated', p.eliminated);
      seatEl.classList.toggle('active-turn', state.handInProgress && state.players[state.turnIdx]?.seatId === seatId);

      const betEl = document.getElementById(`bet-${seatId}`);
      if (p.bet > 0) {
        betEl.textContent = p.bet.toLocaleString();
        betEl.classList.remove('hidden');
      } else {
        betEl.classList.add('hidden');
      }
    });

    animateNumber('pot', state.pot, dom.potAmount, null);
  }

  function setSeatBubble(seatId, text, isThinking = false) {
    const el = document.getElementById(`bubble-${seatId}`);
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('thinking', isThinking);
  }

  function clearAllBubbles() {
    [0, 1, 2, 3].forEach(id => setSeatBubble(id, '', false));
  }

  // ---------------- MATCH INITIALIZATION ----------------
  function startNewMatch() {
    const dict = I18N[state.lang];
    state.handNumber = 0;
    state.smallBlind = 10;
    state.bigBlind = 20;
    state.logEntries = [];
    dom.actionLogList.innerHTML = '';

    if (state.mode === '1v1') {
      state.players = [
        { seatId: 0, name: dict.you, isHuman: true, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false },
        { seatId: 1, name: 'CPU Viktor', isHuman: false, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false }
      ];
    } else {
      state.players = [
        { seatId: 0, name: dict.you, isHuman: true, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false },
        { seatId: 3, name: 'CPU Elena', isHuman: false, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false },
        { seatId: 1, name: 'CPU Marcus', isHuman: false, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false },
        { seatId: 2, name: 'CPU Sofia', isHuman: false, stack: 1000, bet: 0, totalContributed: 0, cards: [], folded: false, allIn: false, eliminated: false }
      ];
    }

    state.displayedValues = { pot: 0, stacks: [1000, 1000, 1000, 1000] };
    state.dealerIdx = Math.floor(Math.random() * state.players.length);
    state.matchActive = true;
    dom.btnResumeGame.classList.remove('hidden');
    dom.menuOverlay.classList.add('hidden');
    dom.gameoverOverlay.classList.add('hidden');

    applyLanguage();
    syncTableSeatsUI();
    startNextHand();
  }

  // ---------------- HAND LIFECYCLE ----------------
  function getNextActivePlayerIdx(fromIdx) {
    const n = state.players.length;
    for (let step = 1; step <= n; step++) {
      const idx = (fromIdx + step) % n;
      if (!state.players[idx].eliminated) return idx;
    }
    return fromIdx;
  }

  function getNextActingPlayerIdx(fromIdx) {
    const n = state.players.length;
    for (let step = 1; step <= n; step++) {
      const idx = (fromIdx + step) % n;
      const p = state.players[idx];
      if (!p.eliminated && !p.folded && !p.allIn) return idx;
    }
    return -1;
  }

  function activeContenders() {
    return state.players.filter(p => !p.eliminated && !p.folded);
  }

  function playersAbleToAct() {
    return state.players.filter(p => !p.eliminated && !p.folded && !p.allIn);
  }

  async function startNextHand() {
    const alivePlayers = state.players.filter(p => p.stack > 0);
    alivePlayers.forEach(p => { p.eliminated = false; });
    state.players.filter(p => p.stack <= 0).forEach(p => { p.eliminated = true; });

    const human = state.players[0];
    if (human.eliminated || alivePlayers.length <= 1) {
      showGameOver(alivePlayers.length === 1 && alivePlayers[0].isHuman);
      return;
    }

    state.handNumber += 1;
    state.handInProgress = true;
    state.waitingForHuman = false;
    state.deck = createShuffledDeck();
    state.community = [];
    state.phase = 'preflop';
    state.pot = 0;
    state.currentBet = 0;
    state.minRaise = state.bigBlind;
    dom.sidePotsDisplay.innerHTML = '';
    dom.resultBanner.classList.add('hidden');
    dom.actionControlsGroup.classList.add('disabled');
    dom.liveStatusText.textContent = I18N[state.lang].statusWaitingCpu;
    clearAllBubbles();

    document.querySelectorAll('.board-slot').forEach(slot => { slot.innerHTML = ''; });
    [0, 1, 2, 3].forEach(id => {
      document.getElementById(`cards-${id}`).innerHTML = '';
      document.getElementById(`role-${id}`).textContent = '';
    });

    for (const p of state.players) {
      p.bet = 0;
      p.totalContributed = 0;
      p.cards = [];
      p.folded = p.eliminated;
      p.allIn = false;
      p.actedThisRound = false;
    }

    state.dealerIdx = getNextActivePlayerIdx(state.dealerIdx);
    const dealerPlayer = state.players[state.dealerIdx];
    moveDealerButtonToSeat(dealerPlayer.seatId);

    addLog(
      I18N[state.lang].newHandLog
        .replace('{num}', state.handNumber)
        .replace('{dealer}', dealerPlayer.name),
      true
    );

    let sbIdx, bbIdx, firstToActIdx;
    if (alivePlayers.length === 2) {
      sbIdx = state.dealerIdx;
      bbIdx = getNextActivePlayerIdx(sbIdx);
      firstToActIdx = sbIdx;
      document.getElementById(`role-${state.players[sbIdx].seatId}`).textContent = 'D / SB';
      document.getElementById(`role-${state.players[bbIdx].seatId}`).textContent = 'BB';
    } else {
      sbIdx = getNextActivePlayerIdx(state.dealerIdx);
      bbIdx = getNextActivePlayerIdx(sbIdx);
      firstToActIdx = getNextActivePlayerIdx(bbIdx);
      document.getElementById(`role-${dealerPlayer.seatId}`).textContent = 'D';
      document.getElementById(`role-${state.players[sbIdx].seatId}`).textContent = 'SB';
      document.getElementById(`role-${state.players[bbIdx].seatId}`).textContent = 'BB';
    }

    updatePhaseBanner();
    syncTableSeatsUI();

    postBlind(state.players[sbIdx], state.smallBlind, 'SB');
    await sleep(160);
    postBlind(state.players[bbIdx], state.bigBlind, 'BB');
    state.currentBet = Math.max(state.players[sbIdx].bet, state.players[bbIdx].bet);

    const dealOrder = [];
    let cursor = sbIdx;
    for (let i = 0; i < alivePlayers.length; i++) {
      dealOrder.push(state.players[cursor]);
      cursor = getNextActivePlayerIdx(cursor);
    }

    for (let round = 0; round < 2; round++) {
      for (const p of dealOrder) {
        const card = state.deck.pop();
        p.cards.push(card);
        const container = document.getElementById(`cards-${p.seatId}`);
        await dealCardWithTrajectory(container, card, p.isHuman, 85);
      }
    }

    updatePlayerHandRankBadge();

    state.turnIdx = state.players[firstToActIdx].allIn
      ? getNextActingPlayerIdx(firstToActIdx)
      : firstToActIdx;

    await runTurnLoop();
  }

  function postBlind(player, amount, label) {
    const actual = Math.min(player.stack, amount);
    player.stack -= actual;
    player.bet += actual;
    player.totalContributed += actual;
    state.pot += actual;
    if (player.stack === 0) player.allIn = true;

    sfx.playChip();
    spawnFlyingChips(document.getElementById(`seat-${player.seatId}`), dom.potAmount, 2);
    setSeatBubble(player.seatId, `${label} ${actual}`);
    addLog(`${player.name}: ${label} (${actual})`);
    syncTableSeatsUI();
  }

  // ---------------- BETTING ROUND & TURN LOOP ----------------
  function isBettingRoundComplete() {
    const contenders = activeContenders();
    if (contenders.length <= 1) return true;

    const acting = playersAbleToAct();
    if (acting.length === 0) return true;

    return acting.every(p => p.actedThisRound && p.bet === state.currentBet);
  }

  async function runTurnLoop() {
    while (state.handInProgress) {
      const contenders = activeContenders();
      if (contenders.length <= 1) {
        await resolveUncontestedWinner(contenders[0]);
        return;
      }

      if (isBettingRoundComplete()) {
        await advancePhase();
        return;
      }

      const currentPlayer = state.players[state.turnIdx];
      if (!currentPlayer || currentPlayer.eliminated || currentPlayer.folded || currentPlayer.allIn) {
        state.turnIdx = getNextActingPlayerIdx(state.turnIdx);
        continue;
      }

      syncTableSeatsUI();

      if (currentPlayer.isHuman) {
        state.waitingForHuman = true;
        updateControlsUI();
        return;
      } else {
        state.waitingForHuman = false;
        dom.actionControlsGroup.classList.add('disabled');
        dom.liveStatusText.textContent = I18N[state.lang].statusWaitingCpu;
        setSeatBubble(currentPlayer.seatId, I18N[state.lang].thinking, true);

        const thinkDelay = state.difficulty === 'easy' ? 620 : state.difficulty === 'medium' ? 780 : 920;
        await sleep(thinkDelay);

        if (!state.handInProgress) return;
        const decision = computeCpuDecision(currentPlayer);
        applyPlayerAction(currentPlayer, decision.type, decision.amount);
        state.turnIdx = getNextActingPlayerIdx(state.turnIdx);
      }
    }
  }

  function applyPlayerAction(player, type, raiseTarget = 0) {
    const dict = I18N[state.lang];
    const toCall = Math.max(0, state.currentBet - player.bet);

    if (type === 'fold') {
      player.folded = true;
      player.actedThisRound = true;
      sfx.playCard();
      setSeatBubble(player.seatId, dict.actions.fold);
      addLog(`${player.name}: ${dict.actions.fold}`);
    } else if (type === 'check') {
      player.actedThisRound = true;
      sfx.playCheck();
      setSeatBubble(player.seatId, dict.actions.check);
      addLog(`${player.name}: ${dict.actions.check}`);
    } else if (type === 'call') {
      const pay = Math.min(player.stack, toCall);
      player.stack -= pay;
      player.bet += pay;
      player.totalContributed += pay;
      state.pot += pay;
      player.actedThisRound = true;
      if (player.stack === 0) player.allIn = true;

      sfx.playChip();
      spawnFlyingChips(document.getElementById(`seat-${player.seatId}`), dom.potAmount, 3);
      const label = player.allIn ? dict.actions.allin : `${dict.actions.call} ${pay}`;
      setSeatBubble(player.seatId, label);
      addLog(`${player.name}: ${label}`);
    } else if (type === 'bet' || type === 'raise') {
      const maxTotalBet = player.bet + player.stack;
      const finalBet = Math.min(maxTotalBet, Math.max(raiseTarget, state.currentBet + state.minRaise, state.bigBlind));
      const added = Math.min(player.stack, finalBet - player.bet);
      const newTotalBet = player.bet + added;
      const raiseDelta = newTotalBet - state.currentBet;

      if (raiseDelta >= state.minRaise) {
        state.minRaise = raiseDelta;
        for (const other of state.players) {
          if (other !== player && !other.folded && !other.eliminated && !other.allIn) {
            other.actedThisRound = false;
          }
        }
      }

      const isOpeningBet = state.currentBet === 0;
      state.currentBet = Math.max(state.currentBet, newTotalBet);
      player.stack -= added;
      player.bet = newTotalBet;
      player.totalContributed += added;
      state.pot += added;
      player.actedThisRound = true;
      if (player.stack === 0) player.allIn = true;

      sfx.playChip();
      spawnFlyingChips(document.getElementById(`seat-${player.seatId}`), dom.potAmount, 4);
      const actionWord = player.allIn
        ? dict.actions.allin
        : isOpeningBet
          ? `${dict.actions.bet} ${newTotalBet}`
          : `${dict.actions.raise} ${newTotalBet}`;
      setSeatBubble(player.seatId, actionWord);
      addLog(`${player.name}: ${actionWord}`);
    }

    syncTableSeatsUI();
    updateSidePotsBadge();
  }

  // ---------------- PHASE PROGRESSION ----------------
  async function advancePhase() {
    dom.actionControlsGroup.classList.add('disabled');
    state.waitingForHuman = false;

    for (const p of state.players) {
      p.bet = 0;
      p.actedThisRound = false;
    }
    state.currentBet = 0;
    state.minRaise = state.bigBlind;
    syncTableSeatsUI();

    const slots = document.querySelectorAll('.board-slot');

    if (state.phase === 'preflop') {
      state.phase = 'flop';
      updatePhaseBanner();
      state.deck.pop();
      for (let i = 0; i < 3; i++) {
        const card = state.deck.pop();
        state.community.push(card);
        await dealCardWithTrajectory(slots[i], card, true, 120);
      }
    } else if (state.phase === 'flop') {
      state.phase = 'turn';
      updatePhaseBanner();
      state.deck.pop();
      const card = state.deck.pop();
      state.community.push(card);
      await dealCardWithTrajectory(slots[3], card, true, 130);
    } else if (state.phase === 'turn') {
      state.phase = 'river';
      updatePhaseBanner();
      state.deck.pop();
      const card = state.deck.pop();
      state.community.push(card);
      await dealCardWithTrajectory(slots[4], card, true, 130);
    } else if (state.phase === 'river') {
      await resolveShowdown();
      return;
    }

    updatePlayerHandRankBadge();
    clearAllBubbles();

    if (playersAbleToAct().length <= 1) {
      await sleep(550);
      await advancePhase();
      return;
    }

    state.turnIdx = getNextActingPlayerIdx(state.dealerIdx);
    await runTurnLoop();
  }

  // ---------------- SIDE POTS & SHOWDOWN ----------------
  function calculateSidePots() {
    const contributors = state.players.filter(p => p.totalContributed > 0);
    const levels = [...new Set(contributors.map(p => p.totalContributed))].sort((a, b) => a - b);

    const pots = [];
    let prevLevel = 0;
    for (const level of levels) {
      const slice = level - prevLevel;
      if (slice <= 0) continue;
      let amount = 0;
      const eligible = [];
      for (const p of contributors) {
        if (p.totalContributed >= level) {
          amount += slice;
          if (!p.folded) eligible.push(p);
        }
      }
      if (amount > 0) pots.push({ amount, eligible });
      prevLevel = level;
    }
    return pots;
  }

  function updateSidePotsBadge() {
    const pots = calculateSidePots();
    dom.sidePotsDisplay.innerHTML = '';
    if (pots.length <= 1) return;
    const dict = I18N[state.lang];
    pots.forEach((potObj, idx) => {
      const tag = document.createElement('span');
      tag.className = 'side-pot-tag';
      const label = idx === 0 ? dict.mainPot : `${dict.sidePot} ${idx}`;
      tag.textContent = `${label}: ${potObj.amount}`;
      dom.sidePotsDisplay.appendChild(tag);
    });
  }

  async function resolveUncontestedWinner(winner) {
    state.phase = 'showdown';
    updatePhaseBanner();
    dom.actionControlsGroup.classList.add('disabled');

    const wonAmount = state.pot;
    winner.stack += wonAmount;
    state.pot = 0;

    sfx.playWin();
    spawnFlyingChips(dom.potAmount, document.getElementById(`seat-${winner.seatId}`), 5);
    syncTableSeatsUI();

    const msg = I18N[state.lang].winUncontested
      .replace('{name}', winner.name)
      .replace('{amount}', wonAmount);
    dom.resultTitle.textContent = msg;
    dom.resultDetail.textContent = '';
    dom.resultBanner.classList.remove('hidden');
    addLog(msg, true);

    await sleep(2300);
    state.handInProgress = false;
    await startNextHand();
  }

  async function resolveShowdown() {
    state.phase = 'showdown';
    updatePhaseBanner();
    dom.actionControlsGroup.classList.add('disabled');
    clearAllBubbles();

    const contenders = activeContenders();

    for (const p of contenders) {
      if (!p.isHuman) {
        const cardEls = document.querySelectorAll(`#cards-${p.seatId} .poker-card`);
        cardEls.forEach(el => el.classList.add('face-up'));
      }
    }

    await sleep(450);

    const evaluations = new Map();
    for (const p of contenders) {
      const evalRes = evaluateBestHand([...p.cards, ...state.community]);
      evaluations.set(p.seatId, evalRes);
      if (!p.isHuman) {
        setSeatBubble(p.seatId, I18N[state.lang].handNames[evalRes.category]);
      }
    }

    const pots = calculateSidePots();
    const totalWinningsBySeat = new Map();
    let mainPotWinners = [];
    let mainPotHandName = '';

    for (let idx = 0; idx < pots.length; idx++) {
      const potObj = pots[idx];
      const eligible = potObj.eligible.length > 0 ? potObj.eligible : contenders;

      let bestScore = -1;
      let potWinners = [];
      for (const p of eligible) {
        const sc = evaluations.get(p.seatId).score;
        if (sc > bestScore) {
          bestScore = sc;
          potWinners = [p];
        } else if (sc === bestScore) {
          potWinners.push(p);
        }
      }

      const share = Math.floor(potObj.amount / potWinners.length);
      let remainder = potObj.amount % potWinners.length;

      for (const w of potWinners) {
        const payout = share + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        w.stack += payout;
        totalWinningsBySeat.set(w.seatId, (totalWinningsBySeat.get(w.seatId) || 0) + payout);
        spawnFlyingChips(dom.potAmount, document.getElementById(`seat-${w.seatId}`), 4);
      }

      if (idx === 0) {
        mainPotWinners = potWinners;
        const winEval = evaluations.get(potWinners[0].seatId);
        mainPotHandName = I18N[state.lang].handNames[winEval.category];
      }
    }

    state.pot = 0;
    sfx.playWin();
    syncTableSeatsUI();

    const winningCardIds = new Set();
    for (const w of mainPotWinners) {
      const bestFive = evaluations.get(w.seatId).cards;
      bestFive.forEach(c => winningCardIds.add(c.id));
    }

    document.querySelectorAll('.poker-card').forEach(cardEl => {
      if (winningCardIds.has(cardEl.dataset.cardId)) {
        cardEl.classList.add('winner-highlight');
      } else {
        cardEl.classList.add('dimmed-card');
      }
    });

    const dict = I18N[state.lang];
    let bannerText = '';
    if (mainPotWinners.length === 1) {
      const w = mainPotWinners[0];
      const wonTotal = totalWinningsBySeat.get(w.seatId) || 0;
      bannerText = dict.winShowdown
        .replace('{name}', w.name)
        .replace('{amount}', wonTotal);
    } else {
      const names = mainPotWinners.map(w => w.name).join(' & ');
      const splitEach = totalWinningsBySeat.get(mainPotWinners[0].seatId) || 0;
      bannerText = dict.splitPot
        .replace('{names}', names)
        .replace('{amount}', splitEach);
    }

    dom.resultTitle.textContent = bannerText;
    dom.resultDetail.textContent = mainPotHandName;
    dom.resultBanner.classList.remove('hidden');
    addLog(`${bannerText} (${mainPotHandName})`, true);

    await sleep(3400);
    state.handInProgress = false;
    await startNextHand();
  }

  // ---------------- CPU INTELLIGENCE (EASY / MEDIUM / HARD) ----------------
  function evaluatePreflopStrength(cards) {
    const [c1, c2] = [...cards].sort((a, b) => b.rank - a.rank);
    const isPair = c1.rank === c2.rank;
    const isSuited = c1.suit === c2.suit;
    const gap = c1.rank - c2.rank;

    let score = (c1.rank + c2.rank) / 28;
    if (isPair) score += 0.28 + (c1.rank / 40);
    if (isSuited) score += 0.08;
    if (gap === 1) score += 0.06;
    if (c1.rank >= 13 && c2.rank >= 10) score += 0.12;
    return Math.min(1, score);
  }

  function hasDrawPotential(cards) {
    if (cards.length < 5 || cards.length >= 7) return false;
    const suitCounts = {};
    for (const c of cards) suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    if (Object.values(suitCounts).some(cnt => cnt === 4)) return true;

    const ranks = [...new Set(cards.map(c => c.rank))].sort((a, b) => a - b);
    for (let i = 0; i <= ranks.length - 4; i++) {
      if (ranks[i + 3] - ranks[i] <= 4) return true;
    }
    return false;
  }

  function computeCpuDecision(cpu) {
    const toCall = Math.max(0, state.currentBet - cpu.bet);
    const maxBetPossible = cpu.bet + cpu.stack;
    const minRaiseTotal = Math.min(maxBetPossible, Math.max(state.currentBet + state.minRaise, state.bigBlind));
    const canRaise = maxBetPossible > state.currentBet && cpu.stack > toCall;

    let strength = 0;
    let isDrawing = false;
    if (state.phase === 'preflop') {
      strength = evaluatePreflopStrength(cpu.cards);
    } else {
      const evalRes = evaluateBestHand([...cpu.cards, ...state.community]);
      strength = Math.min(1, (evalRes.category * 0.16) + (evalRes.tiebreakers[0] / 65));
      isDrawing = hasDrawPotential([...cpu.cards, ...state.community]);
      if (isDrawing) strength = Math.min(1, strength + 0.14);
    }

    const potOdds = toCall > 0 ? toCall / (state.pot + toCall) : 0;
    const rng = Math.random();

    if (state.difficulty === 'easy') {
      if (toCall === 0) {
        if (canRaise && strength > 0.68 && rng < 0.45) return { type: 'bet', amount: minRaiseTotal };
        return { type: 'check' };
      }
      if (strength < 0.24 && toCall > state.bigBlind * 2 && rng < 0.55) return { type: 'fold' };
      if (canRaise && strength > 0.82 && rng < 0.35) return { type: 'raise', amount: minRaiseTotal };
      return { type: 'call' };
    }

    if (state.difficulty === 'medium') {
      if (toCall === 0) {
        if (canRaise && (strength > 0.52 || (isDrawing && rng < 0.35))) {
          const betSize = Math.max(minRaiseTotal, Math.round(state.pot * 0.55));
          return { type: 'bet', amount: betSize };
        }
        return { type: 'check' };
      }
      if (strength + 0.1 < potOdds && rng > 0.15) return { type: 'fold' };
      if (canRaise && strength > 0.72 && rng < 0.55) {
        const raiseSize = Math.max(minRaiseTotal, state.currentBet + Math.round(state.pot * 0.65));
        return { type: 'raise', amount: raiseSize };
      }
      return { type: 'call' };
    }

    const isDealer = state.players[state.dealerIdx]?.seatId === cpu.seatId;
    const positionBonus = isDealer ? 0.06 : 0;
    const effectiveStrength = Math.min(1, strength + positionBonus);

    if (toCall === 0) {
      const shouldBet = effectiveStrength > 0.48 || (isDrawing && rng < 0.55) || (isDealer && rng < 0.28);
      if (canRaise && shouldBet) {
        const sizingFactor = effectiveStrength > 0.75 ? 0.75 : 0.55;
        const betSize = Math.max(minRaiseTotal, Math.round(state.pot * sizingFactor));
        return { type: 'bet', amount: betSize };
      }
      return { type: 'check' };
    }

    if (effectiveStrength > 0.76 && canRaise) {
      const reRaise = Math.max(minRaiseTotal, state.currentBet + Math.round(state.pot * 0.8));
      return { type: 'raise', amount: reRaise };
    }
    if (isDrawing && canRaise && rng < 0.32 && toCall <= state.pot * 0.6) {
      return { type: 'raise', amount: minRaiseTotal };
    }
    if (effectiveStrength >= potOdds * 0.92) return { type: 'call' };
    return { type: 'fold' };
  }

  // ---------------- HUMAN CONTROLS UI ----------------
  function updateControlsUI() {
    const human = state.players[0];
    const dict = I18N[state.lang];
    if (!human || !state.waitingForHuman) {
      dom.actionControlsGroup.classList.add('disabled');
      dom.liveStatusText.textContent = dict.statusWaitingCpu;
      return;
    }

    dom.actionControlsGroup.classList.remove('disabled');
    const toCall = Math.max(0, state.currentBet - human.bet);
    const maxTotal = human.bet + human.stack;
    const minTotal = Math.min(maxTotal, Math.max(state.currentBet + state.minRaise, state.bigBlind));

    dom.btnFold.textContent = dict.fold;
    if (toCall === 0) {
      dom.btnCheckCall.textContent = dict.check;
      dom.liveStatusText.textContent = dict.statusFreeTable;
    } else {
      const pay = Math.min(human.stack, toCall);
      dom.btnCheckCall.textContent = pay >= human.stack ? `${dict.call} (${dict.allIn})` : `${dict.call} ${pay}`;
      dom.liveStatusText.textContent = dict.statusActiveBet
        .replace('{bet}', state.currentBet)
        .replace('{call}', pay)
        .replace('{minRaise}', minTotal);
    }

    const canRaise = maxTotal > state.currentBet && human.stack > toCall;
    dom.betSlider.disabled = !canRaise;
    document.querySelectorAll('.preset-btn').forEach(b => { b.disabled = !canRaise; });
    dom.btnBetRaise.disabled = !canRaise;

    if (canRaise) {
      dom.betSlider.min = minTotal;
      dom.betSlider.max = maxTotal;
      dom.betSlider.step = Math.min(10, Math.max(1, maxTotal - minTotal));
      dom.betSlider.value = minTotal;
      syncRaiseButtonLabel(minTotal);
    } else {
      dom.betSliderVal.textContent = '—';
      dom.btnBetRaise.textContent = dict.allIn;
    }
  }

  function syncRaiseButtonLabel(val) {
    const dict = I18N[state.lang];
    const human = state.players[0];
    const maxTotal = human.bet + human.stack;
    const numeric = Number(val);
    dom.betSliderVal.textContent = numeric.toLocaleString();
    if (numeric >= maxTotal) {
      dom.btnBetRaise.textContent = `${dict.allIn} (${numeric})`;
    } else if (state.currentBet === 0) {
      dom.btnBetRaise.textContent = `${dict.bet} ${numeric}`;
    } else {
      dom.btnBetRaise.textContent = `${dict.raiseTo} ${numeric}`;
    }
  }

  async function handleHumanAction(type) {
    if (!state.waitingForHuman) return;
    state.waitingForHuman = false;
    dom.actionControlsGroup.classList.add('disabled');

    const human = state.players[0];
    const raiseVal = Number(dom.betSlider.value);
    applyPlayerAction(human, type, raiseVal);

    state.turnIdx = getNextActingPlayerIdx(state.turnIdx);
    await runTurnLoop();
  }

  function showGameOver(playerWon) {
    state.handInProgress = false;
    state.matchActive = false;
    dom.btnResumeGame.classList.add('hidden');
    const dict = I18N[state.lang];
    document.getElementById('gameover-icon').textContent = playerWon ? '🏆' : '🃏';
    document.getElementById('gameover-title').textContent = playerWon ? dict.gameOverWinTitle : dict.gameOverLoseTitle;
    document.getElementById('gameover-desc').textContent = playerWon ? dict.gameOverWinDesc : dict.gameOverLoseDesc;
    dom.gameoverOverlay.classList.remove('hidden');
  }

  // ---------------- EVENT LISTENERS ----------------
  function bindEvents() {
    document.querySelectorAll('#lang-selector .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#lang-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.lang = btn.dataset.lang;
        applyLanguage();
      });
    });

    document.querySelectorAll('#mode-selector .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#mode-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.mode;
        applyLanguage();
      });
    });

    document.querySelectorAll('#diff-selector .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#diff-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.difficulty = btn.dataset.diff;
        applyLanguage();
      });
    });

    document.getElementById('btn-start-game').addEventListener('click', startNewMatch);
    document.getElementById('btn-resume-game').addEventListener('click', () => {
      dom.menuOverlay.classList.add('hidden');
    });

    document.getElementById('btn-open-menu').addEventListener('click', () => {
      dom.menuOverlay.classList.remove('hidden');
    });

    document.getElementById('btn-sound').addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      document.getElementById('sound-icon').textContent = sfx.enabled ? '🔊' : '🔇';
    });

    document.getElementById('btn-log-toggle').addEventListener('click', () => {
      dom.logDrawer.classList.toggle('hidden');
    });
    document.getElementById('btn-close-log').addEventListener('click', () => {
      dom.logDrawer.classList.add('hidden');
    });

    // Action Help Modal (? Passar vs Aumentar)
    document.getElementById('btn-action-help').addEventListener('click', () => {
      renderHelpGuideModal();
      dom.helpOverlay.classList.remove('hidden');
    });
    document.getElementById('btn-close-help').addEventListener('click', () => {
      dom.helpOverlay.classList.add('hidden');
    });
    dom.helpOverlay.addEventListener('click', e => {
      if (e.target === dom.helpOverlay) dom.helpOverlay.classList.add('hidden');
    });

    // Rankings Modal
    document.getElementById('btn-rankings').addEventListener('click', () => {
      renderRankingsModal();
      dom.rankingsOverlay.classList.remove('hidden');
    });
    document.getElementById('btn-close-rankings').addEventListener('click', () => {
      dom.rankingsOverlay.classList.add('hidden');
    });
    dom.rankingsOverlay.addEventListener('click', e => {
      if (e.target === dom.rankingsOverlay) dom.rankingsOverlay.classList.add('hidden');
    });

    document.getElementById('btn-play-again').addEventListener('click', startNewMatch);
    document.getElementById('btn-gameover-menu').addEventListener('click', () => {
      dom.gameoverOverlay.classList.add('hidden');
      dom.menuOverlay.classList.remove('hidden');
    });

    dom.betSlider.addEventListener('input', e => syncRaiseButtonLabel(e.target.value));

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const human = state.players[0];
        if (!human) return;
        const minVal = Number(dom.betSlider.min);
        const maxVal = Number(dom.betSlider.max);
        let target = minVal;

        if (btn.dataset.preset === 'min') target = minVal;
        else if (btn.dataset.preset === 'half') target = Math.max(minVal, Math.round(state.currentBet + state.pot * 0.5));
        else if (btn.dataset.preset === 'pot') target = Math.max(minVal, state.currentBet + state.pot);
        else if (btn.dataset.preset === 'allin') target = maxVal;

        target = Math.min(maxVal, Math.max(minVal, target));
        dom.betSlider.value = target;
        syncRaiseButtonLabel(target);
      });
    });

    dom.btnFold.addEventListener('click', () => handleHumanAction('fold'));
    dom.btnCheckCall.addEventListener('click', () => {
      const human = state.players[0];
      const toCall = Math.max(0, state.currentBet - human.bet);
      handleHumanAction(toCall === 0 ? 'check' : 'call');
    });
    dom.btnBetRaise.addEventListener('click', () => {
      handleHumanAction(state.currentBet === 0 ? 'bet' : 'raise');
    });

    window.addEventListener('resize', () => {
      if (state.players[state.dealerIdx]) {
        moveDealerButtonToSeat(state.players[state.dealerIdx].seatId);
      }
    });
  }

  bindEvents();
  applyLanguage();
})();
