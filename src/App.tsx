import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ModeProvider } from './contexts/ModeContext'
import { AppShell } from './components/Layout/AppShell'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Breathing from './pages/Breathing'
import Journal from './pages/Journal'
import Resources from './pages/Resources'

export default function App() {
  return (
    <ModeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/breathe" element={<Breathing />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/resources" element={<Resources />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModeProvider>
  )
}
