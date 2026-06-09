import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useQuotes } from '../hooks/useQuotes'
import { QuoteCard } from '../components/Quotes/QuoteCard'
import { ModeToggle } from '../components/Layout/ModeToggle'
import './Home.css'

const NAV_CARDS = [
  {
    to: '/breathe',
    icon: '◎',
    title: 'Breathe',
    desc: 'Guided breathing techniques',
    downLabel: 'Slow the nervous system',
    upLabel: 'Find your rhythm',
  },
  {
    to: '/gallery',
    icon: '⬡',
    title: 'Gallery',
    desc: 'Soothing visual space',
    downLabel: 'Rest your eyes here',
    upLabel: 'Find your spark',
  },
  {
    to: '/journal',
    icon: '◈',
    title: 'Journal',
    desc: 'Write what\'s present',
    downLabel: 'Let it out safely',
    upLabel: 'Capture this energy',
  },
  {
    to: '/resources',
    icon: '♬',
    title: 'Listen',
    desc: 'Curated audio resources',
    downLabel: 'Let sound hold you',
    upLabel: 'Music to move you',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function Home() {
  const { mode } = useMode()
  const { quotes } = useQuotes(mode)

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.header
        className="home__header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="home__greeting">
          <span className="home__logo">◎</span>
          <h1 className="home__title">soma</h1>
        </div>
        <p className="home__subtitle">
          {mode === 'down'
            ? 'You are safe. You are here. This moment is enough.'
            : 'You have what you need. Begin from here.'}
        </p>
      </motion.header>

      {/* Mode toggle (prominent) */}
      <motion.div
        className="home__toggle-wrap"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="home__toggle-label">
          {mode === 'down' ? 'Currently calming ↓' : 'Currently energizing ↑'}
        </p>
        <ModeToggle />
      </motion.div>

      {/* Quote */}
      <QuoteCard quotes={quotes} />

      {/* Nav cards */}
      <motion.section
        className="home__cards"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {NAV_CARDS.map(card => (
          <motion.div key={card.to} variants={cardAnim}>
            <Link to={card.to} className="home__nav-card">
              <span className="home__nav-icon">{card.icon}</span>
              <div className="home__nav-body">
                <h3 className="home__nav-title">{card.title}</h3>
                <p className="home__nav-desc">
                  {mode === 'down' ? card.downLabel : card.upLabel}
                </p>
              </div>
              <span className="home__nav-arrow">→</span>
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  )
}
