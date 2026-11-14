import { state, SUIT_SYMBOLS, RANK_LABELS, evaluateBestHand, calculateSidePots } from './engine.js';
import { I18N } from './i18n.js';
import { sfx } from './audio.js';
import { sleep } from './utils.js';

// ---------------- DOM CACHE ----------------
export const dom = {
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

// ---------------- SMOOTH NUMBER ANIMATION (60FPS) ----------------
export function animateNumber(key, target, element, seatIndex = null) {
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
export function spawnFlyingChips(fromEl, toEl, count = 3) {
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
export function createCardElement(card, faceUp = false) {
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

export async function dealCardWithTrajectory(container, card, faceUp, delayMs = 0) {
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
export function renderHelpGuideModal() {
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

export function applyLanguage() {
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

export function renderRankingsModal() {
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

export function addLog(text, highlight = false) {
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

export function updatePhaseBanner() {
  dom.phaseBanner.textContent = I18N[state.lang].phases[state.phase] || '';
}

export function updatePlayerHandRankBadge() {
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

export function moveDealerButtonToSeat(seatId) {
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

export function syncTableSeatsUI() {
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

export function setSeatBubble(seatId, text, isThinking = false) {
  const el = document.getElementById(`bubble-${seatId}`);
  if (!el) return;
  el.textContent = text || '';
  el.classList.toggle('thinking', isThinking);
}

export function clearAllBubbles() {
  [0, 1, 2, 3].forEach(id => setSeatBubble(id, '', false));
}

export function updateSidePotsBadge() {
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

// ---------------- HUMAN CONTROLS UI ----------------
export function updateControlsUI() {
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

export function syncRaiseButtonLabel(val) {
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

export function showGameOver(playerWon) {
  state.handInProgress = false;
  state.matchActive = false;
  dom.btnResumeGame.classList.add('hidden');
  const dict = I18N[state.lang];
  document.getElementById('gameover-icon').textContent = playerWon ? '🏆' : '🃏';
  document.getElementById('gameover-title').textContent = playerWon ? dict.gameOverWinTitle : dict.gameOverLoseTitle;
  document.getElementById('gameover-desc').textContent = playerWon ? dict.gameOverWinDesc : dict.gameOverLoseDesc;
  dom.gameoverOverlay.classList.remove('hidden');
}
