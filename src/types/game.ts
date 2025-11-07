/**
 * ターンの型定義
 */
export type Turn = 'fst' | 'snd';

/**
 * ゲームアクションの型定義
 */
export type ActionType = 'Fold' | 'Call' | 'Check' | 'Allin' | 'Bet' | 'Raise';

export type Action =
  | { type: 'Fold' }
  | { type: 'Call' }
  | { type: 'Check' }
  | { type: 'Allin' }
  | { type: 'Bet'; amount: number }
  | { type: 'Raise'; amount: number };

export type GameState = 'Init' | 'Checked' | 'Betted' | 'Folded' | 'Showdown';

/**
 * ゲーム履歴の型定義
 */
export type GameHistory = {
  playerIds: [string, string];
  fstHand: number;
  sndHand: number;
  fstInitialStack: number;
  sndInitialStack: number;
  actions: Action[];
};

