/**
 * ゲームアクションの型定義
 */
export type Action =
  | { type: 'Fold' }
  | { type: 'Call' }
  | { type: 'Check' }
  | { type: 'Allin' }
  | { type: 'Bet'; amount: number }
  | { type: 'Raise'; amount: number };

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

