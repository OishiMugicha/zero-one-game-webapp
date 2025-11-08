import './App.css'
import { useState } from 'react'
import type { History, ActionType, Action } from './types/game'
import { currentTurn, currentPot, currentFstStack, currentSndStack, getAvailableActions, fstBetAmount, sndBetAmount } from './utils/gameCalculations'
import { randomAction } from './utils/strategy'

function App() {

  const [history, setHistory] = useState<History>({
    playerIds: ['P1', 'P2'],
    fstHand: Math.random(),
    sndHand: Math.random(),
    fstInitialStack: 0.5,
    sndInitialStack: 0.5,
    actions: [],
  })

  const actions = getAvailableActions(history)
  const minValue = Math.abs(fstBetAmount(history) - sndBetAmount(history))
  const maxValue = Math.max(currentFstStack(history), currentSndStack(history))
  const [betAmount, setBetAmount] = useState<number>(minValue)
  const colorStyle = (a: ActionType) => ({
    backgroundColor: a === 'Fold' ? 'blue'
      : a === 'Check' ? 'green'
      : a === 'Call' ? 'green'
      : a === 'Bet' ? 'red'
      : a === 'Raise' ? 'red'
      : 'purple',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
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
  const badgeStyle = {
    padding: '8px 12px',
    background: '#f3f4f6',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }
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

  const handleRandomAction = () => {
    const action = randomAction(history)
    setHistory(prev => {
      const nextActions = [...prev.actions, action]
      const nextHistory = { ...prev, actions: nextActions }
      const nextMin = Math.abs(fstBetAmount(nextHistory) - sndBetAmount(nextHistory))
      setBetAmount(nextMin)
      return nextHistory
    })
  }

  const handleNewGame = () => {
    setHistory({
      playerIds: ['P1', 'P2'],
      fstHand: Math.random(),
      sndHand: Math.random(),
      fstInitialStack: 0.5,
      sndInitialStack: 0.5,
      actions: [],
    })
  }

  return (
    <>
      <div className="layout-grid">
        <div className="grid-header">
          <h1>Zero-One Game</h1>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '8px' }}>
            <button
              onClick={handleRandomAction}
              style={{
                padding: '10px 16px',
                fontSize: '1rem',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Random Action
            </button>
            <button
              onClick={handleNewGame}
              style={{
                padding: '10px 16px',
                fontSize: '1rem',
                backgroundColor: '#6336f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              New Game
            </button>
          </div>
        </div>
        <section className="panel">
          <h2>先手</h2>
          {renderBar('fstHand', history.fstHand, '#7a3cff')}
          {renderBar('fstStack', currentFstStack(history), '#2d8cf0')}
        </section>
        <section className="panel">
          <h2>後手</h2>
          {renderBar('sndHand', history.sndHand, '#ff4d4f')}
          {renderBar('sndStack', currentSndStack(history), '#19be6b')}
        </section>
        <section className="panel third-column">
          <div className="subsection">
            <h2>ポット</h2>
            {renderBar('pot', currentPot(history), '#ff9900')}
          </div>
          <div className="subsection">
            <h2>ターン</h2>
            <div>{currentTurn(history) === 'fst' ? '先手' : '後手'}</div>
          </div>
          <div className="subsection">
            <h2>アクション</h2>
            <div className="actions">
              {actions.map(a => (
                <button key={a} style={colorStyle(a)} onClick={() => handleActionClick(a)}>{a}</button>
              ))}
            </div>
            {(actions.includes('Bet') || actions.includes('Raise')) && (
              <div style={{ marginTop: '8px' }}>
                {renderBar('betAmount', betAmount, '#ff4d4f')}
                <input
                  type="range"
                  min={minValue}
                  max={maxValue}
                  step={0.01}
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </section>
        <aside className="panel history-panel">
          <h2>履歴</h2>
          <div className="history-list">
            {history.actions.length === 0 ? (
              <div style={badgeStyle}>アクションはまだありません</div>
            ) : (
              history.actions.map((action, idx) => (
                <div key={idx} style={badgeStyle}>
                  <div>{action.type}</div>
                  {'amount' in action && action.amount !== undefined && (
                    <div>{action.amount.toFixed(2)}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

export default App
