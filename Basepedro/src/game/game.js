import { state, createShuffledDeck, evaluateBestHand, calculateSidePots } from './engine.js';
import { computeCpuDecision } from './ai.js';
import { I18N } from './i18n.js';
import { sfx } from './audio.js';
import { sleep } from './utils.js';
import {
  dom,
  syncTableSeatsUI,
  setSeatBubble,
  clearAllBubbles,
  spawnFlyingChips,
  dealCardWithTrajectory,
  renderHelpGuideModal,
  applyLanguage,
  renderRankingsModal,
  addLog,
  updatePhaseBanner,
  updatePlayerHandRankBadge,
  moveDealerButtonToSeat,
  updateSidePotsBadge,
  updateControlsUI,
  syncRaiseButtonLabel,
  showGameOver
} from './ui.js';

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

export function boot() {
  bindEvents();
  applyLanguage();
}
