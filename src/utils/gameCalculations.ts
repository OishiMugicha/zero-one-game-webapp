import type { GameState, GameHistory, Turn, ActionType } from '../types/game';

/**
 * 最初のプレイヤーの現在のスタックを計算
 */
export function fstStack(history: GameHistory): number {
  let fstStack = history.fstInitialStack;
  let sndStack = history.sndInitialStack;
  let lastBetAmount = 0;

  for (let i = 0; i < history.actions.length; i++) {
    const action = history.actions[i];
    const isFstTurn = i % 2 === 0;

    if (isFstTurn) {
      // fstプレイヤーのターン
      if (action.type === 'Bet' || action.type === 'Raise') {
        const amount = action.amount;
        fstStack -= amount;
        lastBetAmount = amount;
      } else if (action.type === 'Call') {
        fstStack -= lastBetAmount;
      } else if (action.type === 'Allin') {
        fstStack = 0;
      }
      // Fold と Check はスタックに影響なし
    } else {
      // sndプレイヤーのターン
      if (action.type === 'Bet' || action.type === 'Raise') {
        const amount = action.amount;
        sndStack -= amount;
        lastBetAmount = amount;
      } else if (action.type === 'Call') {
        sndStack -= lastBetAmount;
      } else if (action.type === 'Allin') {
        sndStack = 0;
      }
      // Fold と Check はスタックに影響なし
    }
  }

  return fstStack;
}

/**
 * 2番目のプレイヤーの現在のスタックを計算
 */
export function sndStack(history: GameHistory): number {
  let fstStack = history.fstInitialStack;
  let sndStack = history.sndInitialStack;
  let lastBetAmount = 0;

  for (let i = 0; i < history.actions.length; i++) {
    const action = history.actions[i];
    const isFstTurn = i % 2 === 0;

    if (isFstTurn) {
      // fstプレイヤーのターン
      if (action.type === 'Bet' || action.type === 'Raise') {
        const amount = action.amount;
        fstStack -= amount;
        lastBetAmount = amount;
      } else if (action.type === 'Call') {
        fstStack -= lastBetAmount;
      } else if (action.type === 'Allin') {
        fstStack = 0;
      }
      // Fold と Check はスタックに影響なし
    } else {
      // sndプレイヤーのターン
      if (action.type === 'Bet' || action.type === 'Raise') {
        const amount = action.amount;
        sndStack -= amount;
        lastBetAmount = amount;
      } else if (action.type === 'Call') {
        sndStack -= lastBetAmount;
      } else if (action.type === 'Allin') {
        sndStack = 0;
      }
      // Fold と Check はスタックに影響なし
    }
  }

  return sndStack;
}

/**
 * ポットの合計を計算
 */
export function pot(history: GameHistory): number {
  return (
    history.fstInitialStack +
    history.sndInitialStack -
    fstStack(history) -
    sndStack(history)
  );
}

/**
 * 現在のターンを計算
 */
export function currentTurn(history: GameHistory): Turn {
  return history.actions.length % 2 === 0 ? 'fst' : 'snd';
}

export function fstBetAmount(history: GameHistory): number {
  let lastBetAmount = 0;
  for (let i = 0; i < history.actions.length; i++) {
    const action = history.actions[i];
    if (action.type === 'Bet' || action.type === 'Raise') {
      lastBetAmount = action.amount;
    }
  }
  return lastBetAmount;
}

export function sndBetAmount(history: GameHistory): number {
  let lastBetAmount = 0;
  for (let i = 0; i < history.actions.length; i++) {
    const action = history.actions[i];
    if (action.type === 'Bet' || action.type === 'Raise') {
      lastBetAmount = action.amount;
    }
  }
  return lastBetAmount;
}

export function getGameState(history: GameHistory): GameState {
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

export function getAvailableActions(history: GameHistory): ActionType[] {
  let turn = currentTurn(history);
  let allinRequired = false;
  if (turn === 'fst') {
    allinRequired = sndBetAmount(history) >= fstStack(history);
  } else {
    allinRequired = fstBetAmount(history) >= sndStack(history);
  }
  
  if (getGameState(history) === 'Init' || getGameState(history) === 'Checked') {
    return ['Check', 'Bet', 'Allin'];
  } else if (getGameState(history) === 'Betted') {
    if (allinRequired) {
      return ['Fold', 'Call'];
    } else {
      return ['Fold', 'Call', 'Bet', 'Allin'];
    }
  } else if (getGameState(history) === 'Folded' || getGameState(history) === 'Showdown') {
    return [];
  } else {
    throw new Error('Invalid game state');
  }
}

