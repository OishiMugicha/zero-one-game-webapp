import './App.css'
import { useState } from 'react'
import type { History, ActionType, Action } from './types/game'
import { currentTurn, currentPot, currentFstStack, currentSndStack, getAvailableActions, fstBetAmount, sndBetAmount } from './utils/gameCalculations'

function App() {

  const [history, setHistory] = useState<History>({
    playerIds: ['P1', 'P2'],
    fstHand: 0.14,
    sndHand: 0.83,
    fstInitialStack: 0.5,
    sndInitialStack: 0.5,
    actions: [{'type': 'Bet', 'amount': 0.2}, {'type': 'Raise', 'amount': 0.35}],
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
  const barBase = { height: 12, background: '#eee', borderRadius: 6 }
  const barFill = (w: number, color: string) => ({ width: `${Math.max(0, Math.min(1, w)) * 100}%`, height: '100%', background: color, borderRadius: 6 })
  const renderBar = (label: string, value: number, color: string) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span>{label}</span><span>{value.toFixed(2)}</span>
      </div>
      <div style={barBase}><div style={barFill(value, color)} /></div>
    </div>
  )
  const handleActionClick = (actionType: ActionType) => {
    const action: Action = actionType === 'Bet' || actionType === 'Raise'
      ? { type: actionType, amount: betAmount }
      : actionType === 'Allin'
        ? { type: 'Allin' }
        : { type: actionType }

    setHistory(prev => {
      const nextActions = [...prev.actions, action]
      const nextHistory = { ...prev, actions: nextActions }
      const nextMin = Math.abs(fstBetAmount(nextHistory) - sndBetAmount(nextHistory))
      setBetAmount(nextMin)
      return nextHistory
    })
  }

  return (
    <>
      <div className="container">
        <h1>Zero-One Game</h1>
        <section>
          <h2>ハンド</h2>
          {renderBar('fstHand', history.fstHand, '#7a3cff')}
          {renderBar('sndHand', history.sndHand, '#ff4d4f')}
        </section>
        <section>
          <h2>ターン</h2>
          <div>{currentTurn(history) === 'fst' ? '先手' : '後手'}</div>
        </section>
        <section>
          <h2>ポット</h2>
          {renderBar('pot', currentPot(history), '#ff9900')}
        </section>
        <section>
          <h2>スタック</h2>
          {renderBar('fstStack', currentFstStack(history), '#2d8cf0')}
          {renderBar('sndStack', currentSndStack(history), '#19be6b')}
        </section>
        <section>
          <h2>アクション</h2>
          <div className="actions">
            {actions.map(a => (
              <button key={a} style={colorStyle(a)} onClick={() => handleActionClick(a)}>{a}</button>
            ))}
          </div>
          {(actions.includes('Bet') || actions.includes('Raise')) && (
            <div style={{ marginTop: '10px' }}>
              {renderBar('betAmount', betAmount, '#ff4d4f')}
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
