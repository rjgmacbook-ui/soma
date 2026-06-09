import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Mode } from '../lib/supabase'

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  toggle: () => void
  isTransitioning: boolean
}

const ModeContext = createContext<ModeContextType | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem('soma_mode') as Mode) || 'down'
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem('soma_mode', mode)
  }, [mode])

  const setMode = useCallback((newMode: Mode) => {
    setIsTransitioning(true)
    setModeState(newMode)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [])

  const toggle = useCallback(() => {
    setMode(mode === 'down' ? 'up' : 'down')
  }, [mode, setMode])

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle, isTransitioning }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
