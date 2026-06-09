import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Nav } from './Nav'
import { ModeToggle } from './ModeToggle'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-wrapper">
      <div className="app-shell">
        <Nav />

        <div className="app-shell__right">
          <div className="app-shell__topbar">
            <ModeToggle />
          </div>

          <main className="page-content">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
