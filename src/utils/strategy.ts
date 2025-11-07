import { currentFstStack, currentSndStack, currentTurn, fstBetAmount, getGameState, sndBetAmount } from "./gameCalculations";
import type { Action, History } from "../types/game";

export function randomAction(history: History): Action {
  const t = Math.random();
  const minBetAmount = Math.abs(fstBetAmount(history) - sndBetAmount(history));
  const maxBetAmount = Math.max(currentFstStack(history), currentSndStack(history));
  const betAmount = t * minBetAmount + (1 - t) * maxBetAmount;
  const state = getGameState(history);
  if (state === 'Init' || state === 'Checked') {
    const rnd = Math.random();
    if (rnd < 0.5) {
      return { type: 'Check' };
    } else {
      return { type: 'Bet', amount: betAmount };
    }
  } else if (state === 'Betted') {
    let allinRequired = false;
    if (currentTurn(history) === 'fst') {
      allinRequired = sndBetAmount(history) >= history.fstInitialStack;
    } else {
      allinRequired = fstBetAmount(history) >= history.sndInitialStack;
    }
    if (allinRequired) {
      const rnd = Math.random();
      if (rnd < 0.5) {
        return { type: 'Fold' };
      } else {
        return { type: 'Call' };
      }
    } else {
      const rnd = Math.random();
      if (rnd < 0.3) {
        return { type: 'Fold' };
      } else if (rnd < 0.6) {
        return { type: 'Call' };
      } else if (rnd < 0.9) {
        return { type: 'Raise', amount: betAmount };
      } else {
        return { type: 'Allin' };
      }
    }
  } else {
    throw new Error('Invalid game state');
  }
}