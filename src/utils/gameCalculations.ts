import type { GameState, History, Turn, ActionType } from '../types/game';

export function currentTurn(history: History): Turn {
  return history.actions.length % 2 === 0 ? 'fst' : 'snd';
}

export function fstBetAmount(history: History): number {
  let betAmount = 0;
  for(let i = 0; i < history.actions.length; ++i){
    if (i % 2 === 1) {
      continue;
    } else {
      let action = history.actions[i];
      if (action.type === 'Bet' || action.type === 'Raise'){
        betAmount += action.amount;
      } else if (action.type === 'Allin'){
        return history.fstInitialStack;
      } else if (action.type === 'Call') {
        return sndBetAmount(history);
      }
    }
  }
  return betAmount;
}

export function sndBetAmount(history: History): number {
  let betAmount = 0;
  for(let i = 0; i < history.actions.length; ++i){
    if (i % 2 === 0) {
      continue;
    } else {
      let action = history.actions[i];
      if (action.type === 'Bet' || action.type === 'Raise'){
        betAmount += action.amount;
      } else if (action.type === 'Allin'){
        return history.fstInitialStack;
      } else if (action.type === 'Call'){
        return fstBetAmount(history);
      }
    }
  }
  return betAmount;
}

export function currentPot(history: History): number {
  if (getGameState(history) === 'Folded' || getGameState(history) === 'Showdown'){
    return 0;
  } else {
    return fstBetAmount(history) + sndBetAmount(history);
  }
}

export function currentFstStack(history: History): number {
  if (getGameState(history) === 'Folded'){
    if(currentTurn(history) === 'fst'){
      return history.fstInitialStack + sndBetAmount(history);
    } else {
      return history.fstInitialStack - fstBetAmount(history);
    } 
  } else if (getGameState(history) === 'Showdown'){
    if(history.fstHand > history.sndHand) {
      return history.fstInitialStack + sndBetAmount(history);
    } else {
      return history.fstInitialStack - fstBetAmount(history);
    }
  } else {
    return history.fstInitialStack - fstBetAmount(history);
  }
}

export function currentSndStack(history: History): number {
  if (getGameState(history) === 'Folded'){
    if(currentTurn(history) === 'snd'){
      return history.sndInitialStack + fstBetAmount(history);
    } else {
      return history.sndInitialStack - sndBetAmount(history);
    } 
  } else if (getGameState(history) === 'Showdown'){
    if(history.sndHand > history.fstHand) {
      return history.sndInitialStack + fstBetAmount(history);
    } else {
      return history.sndInitialStack - sndBetAmount(history);
    }
  } else {
    return history.sndInitialStack - sndBetAmount(history);
  }
}

export function getGameState(history: History): GameState {
  if (history.actions.length === 0) {
    return 'Init';
  }
  const lastAction = history.actions[history.actions.length - 1];
  if (lastAction.type === 'Check') {
    if (history.actions.length === 1) {
      return 'Checked';
    }
    return 'Showdown';
  } else if (lastAction.type === 'Call') {
    return 'Showdown';
  } else if (lastAction.type === 'Bet' || lastAction.type === 'Raise' || lastAction.type === 'Allin') {
    return 'Betted';
  } else if (lastAction.type === 'Fold') {
    return 'Folded';
  } else {
    throw new Error('Invalid action type');
  }
}

export function getAvailableActions(history: History): ActionType[] {
  let turn = currentTurn(history);
  let allinRequired = false;
  if (turn === 'fst') {
    allinRequired = sndBetAmount(history) >= history.fstInitialStack;
  } else {
    allinRequired = fstBetAmount(history) >= history.sndInitialStack;
  }
  
  if (getGameState(history) === 'Init' || getGameState(history) === 'Checked') {
    return ['Check', 'Bet', 'Allin'];
  } else if (getGameState(history) === 'Betted') {
    if (allinRequired) {
      return ['Fold', 'Call'];
    } else {
      return ['Fold', 'Call', 'Raise', 'Allin'];
    }
  } else if (getGameState(history) === 'Folded' || getGameState(history) === 'Showdown') {
    return [];
  } else {
    throw new Error('Invalid game state');
  }
}

