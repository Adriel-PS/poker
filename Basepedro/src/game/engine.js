// ---------------- CARD & DECK UTILITIES ----------------
export const SUITS = ['s', 'h', 'd', 'c'];
export const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
export const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const RANK_LABELS = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A'
};

export function createShuffledDeck() {
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
export function evaluateFiveCards(cards) {
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

export function evaluateBestHand(cards) {
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
export const state = {
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

// ---------------- CPU INTELLIGENCE (EASY / MEDIUM / HARD) ----------------
export function evaluatePreflopStrength(cards) {
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

export function hasDrawPotential(cards) {
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

// ---------------- SIDE POTS & SHOWDOWN ----------------
export function calculateSidePots(players = state.players) {
  const contributors = players.filter(p => p.totalContributed > 0);
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
