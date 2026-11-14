import { state, evaluateBestHand, evaluatePreflopStrength, hasDrawPotential } from './engine.js';

export function computeCpuDecision(cpu) {
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
