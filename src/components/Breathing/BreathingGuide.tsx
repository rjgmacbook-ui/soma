import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../../contexts/ModeContext'
import './BreathingGuide.css'

type Technique = 'four-seven-eight' | 'box' | 'physiological-sigh'

interface TechniqueConfig {
  name: string
  description: string
  phases: Phase[]
}

interface Phase {
  label: string
  duration: number  // how long to stay in this phase (seconds)
  scale: number     // target circle scale for this phase
  animDuration: number  // how long the circle transition should take
}

const TECHNIQUES: Record<Technique, TechniqueConfig> = {
  'four-seven-eight': {
    name: '4-7-8',
    description: 'Calming breath that activates the parasympathetic nervous system',
    phases: [
      { label: 'Inhale',  duration: 4,  scale: 1.4, animDuration: 4 },
      { label: 'Hold',    duration: 7,  scale: 1.4, animDuration: 0.05 },
      { label: 'Exhale',  duration: 8,  scale: 1.0, animDuration: 8 },
    ],
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equal-ratio breathing for balance and focus',
    phases: [
      { label: 'Inhale',  duration: 4, scale: 1.4, animDuration: 4 },
      { label: 'Hold',    duration: 4, scale: 1.4, animDuration: 0.05 },
      { label: 'Exhale',  duration: 4, scale: 1.0, animDuration: 4 },
      { label: 'Hold',    duration: 4, scale: 1.0, animDuration: 0.05 },
    ],
  },
  'physiological-sigh': {
    name: 'Physiological Sigh',
    description: 'Double inhale + long exhale — fastest known way to reduce stress',
    phases: [
      { label: 'Inhale deeply',   duration: 3,   scale: 1.3,  animDuration: 3 },
      { label: 'Sniff (top off)', duration: 1.5, scale: 1.45, animDuration: 1.5 },
      { label: 'Long exhale',     duration: 8,   scale: 1.0,  animDuration: 8 },
    ],
  },
}

export function BreathingGuide() {
  const { mode } = useMode()
  const defaultTechnique: Technique = mode === 'down' ? 'four-seven-eight' : 'box'
  const [technique, setTechnique] = useState<Technique>(defaultTechnique)
  const [isRunning, setIsRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setTechnique(mode === 'down' ? 'four-seven-eight' : 'box')
    setIsRunning(false)
    setPhaseIdx(0)
    setElapsed(0)
  }, [mode])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const config = TECHNIQUES[technique]
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const currentPhase = config.phases[phaseIdx]
        const next = prev + 0.1
        if (next >= currentPhase.duration) {
          setPhaseIdx(p => (p + 1) % config.phases.length)
          return 0
        }
        return next
      })
    }, 100)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, technique, phaseIdx])

  const config = TECHNIQUES[technique]
  const phase = config.phases[phaseIdx]

  const targetScale = isRunning ? phase.scale : 1.0
  const animDuration = isRunning ? phase.animDuration : 0.6

  return (
    <div className="breathing-guide">
      {/* Technique Selector */}
      <div className="breathing-guide__tabs">
        {(Object.entries(TECHNIQUES) as [Technique, TechniqueConfig][]).map(([key, val]) => (
          <button
            key={key}
            className={`breathing-guide__tab ${technique === key ? 'active' : ''}`}
            onClick={() => {
              setTechnique(key)
              setIsRunning(false)
              setPhaseIdx(0)
              setElapsed(0)
            }}
          >
            {val.name}
          </button>
        ))}
      </div>

      <p className="breathing-guide__desc">{config.description}</p>

      {/* Breathing Circle */}
      <div className="breathing-guide__circle-wrap">
        <motion.div
          className="breathing-guide__ring"
          animate={{ scale: targetScale * 1.2, opacity: isRunning ? 0.2 : 0.08 }}
          transition={{ duration: animDuration, ease: 'easeInOut' }}
        />

        <motion.div
          className="breathing-guide__circle"
          animate={{ scale: targetScale }}
          transition={{ duration: animDuration, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isRunning ? `${phaseIdx}-${phase.label}` : 'start'}
              className="breathing-guide__phase-label"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {isRunning ? phase.label : 'ready'}
            </motion.span>
          </AnimatePresence>

          {isRunning && (
            <span className="breathing-guide__countdown">
              {Math.max(0, Math.ceil(phase.duration - elapsed))}s
            </span>
          )}
        </motion.div>
      </div>

      {/* Phase indicators */}
      <div className="breathing-guide__phases">
        {config.phases.map((p, i) => (
          <div
            key={i}
            className={`breathing-guide__phase-chip ${isRunning && i === phaseIdx ? 'active' : ''}`}
          >
            <span className="breathing-guide__phase-name">{p.label}</span>
            <span className="breathing-guide__phase-dur">{p.duration}s</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className={`btn ${isRunning ? '' : 'btn-primary'} breathing-guide__btn`}
        onClick={() => {
          if (isRunning) {
            setIsRunning(false)
            setPhaseIdx(0)
            setElapsed(0)
          } else {
            setIsRunning(true)
          }
        }}
      >
        {isRunning ? 'Stop' : 'Begin'}
      </button>
    </div>
  )
}
