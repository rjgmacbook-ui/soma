import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/animations.css'
import App from './App.tsx'

const saved = localStorage.getItem('soma_mode') ?? 'down'
document.documentElement.setAttribute('data-mode', saved)

createRoot(document.getElementById('root')!).render(
  <App />
)
