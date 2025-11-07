import './App.css'
import { useState } from 'react'
import type { History, ActionType } from './types/game'
import { currentTurn, currentPot, currentFstStack, currentSndStack, getAvailableActions, fstBetAmount, sndBetAmount } from './utils/gameCalculations'

function App() {

  const [history] = useState<History>({
    playerIds: ['P1', 'P2'],
    fstHand: 0.14,
    sndHand: 0.83,
    fstInitialStack: 1,
    sndInitialStack: 1,
    actions: [{'type': 'Bet', 'amount': 0.3}, {'type': 'Raise', 'amount': 0.5}],
  })

  const actions = getAvailableActions(history)
  const minValue = Math.abs(fstBetAmount(history) - sndBetAmount(history))
  const maxValue = 1
  const [betAmount, setBetAmount] = useState<number>(minValue)
  const colorStyle = (a: ActionType) => ({
    backgroundColor: a === 'Fold' ? 'blue'
      : a === 'Call' ? 'green'
      : a === 'Bet' ? 'red'
      : a === 'Raise' ? 'red'
      : 'purple',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  })

  return (
    <>
      <div className="container">
        <h1>Zero-One Game</h1>
        <section>
          <h2>ハンド</h2>
          <div>fstHand: {history.fstHand}</div>
          <div>sndHand: {history.sndHand}</div>
        </section>
        <section>
          <h2>ターン</h2>
          <div>{currentTurn(history) === 'fst' ? '先手' : '後手'}</div>
        </section>
        <section>
          <h2>ポット</h2>
          <div>{currentPot(history)}</div>
        </section>
        <section>
          <h2>スタック</h2>
          <div>fstStack: {currentFstStack(history)}</div>
          <div>sndStack: {currentSndStack(history)}</div>
        </section>
        <section>
          <h2>アクション</h2>
          <div className="actions">
            {actions.map(a => (
              <button key={a} style={colorStyle(a)}>{a}</button>
            ))}
          </div>
          {(actions.includes('Bet') || actions.includes('Raise')) && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '6px' }}>Bet amount: {betAmount}</div>
              <input
                type="range"
                min={minValue}
                max={maxValue}
                step={0.01}
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                style={{ width: '240px' }}
              />
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default App
