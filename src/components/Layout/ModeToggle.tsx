import { useMode } from '../../contexts/ModeContext'
import './ModeToggle.css'

export function ModeToggle() {
  const { mode, toggle, isTransitioning } = useMode()

  return (
    <button
      className={`mode-toggle ${mode} ${isTransitioning ? 'transitioning' : ''}`}
      onClick={toggle}
      aria-label={`Switch to ${mode === 'down' ? 'up-regulating' : 'down-regulating'} mode`}
    >
      <span className="mode-toggle__track">
        <span className="mode-toggle__thumb" />
        <span className={`mode-toggle__label mode-toggle__label--down ${mode === 'down' ? 'active' : ''}`}>
          calm ↓
        </span>
        <span className={`mode-toggle__label mode-toggle__label--up ${mode === 'up' ? 'active' : ''}`}>
          energize ↑
        </span>
      </span>
    </button>
  )
}
