import { motion } from 'framer-motion'
import { BreathingGuide } from '../components/Breathing/BreathingGuide'
import './PageShared.css'

export default function Breathing() {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Breathe</h1>
        <p className="page__subtitle">
          Your breath is always available. Let it be your anchor.
        </p>
      </header>

      <BreathingGuide />
    </motion.div>
  )
}
