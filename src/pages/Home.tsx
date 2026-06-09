import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import './Home.css'

const NAV_CARDS = [
  {
    to: '/breathe',
    icon: '◎',
    title: 'Breathe',
    downLabel: 'Slow the nervous system',
    upLabel: 'Find your rhythm',
  },
  {
    to: '/gallery',
    icon: '⬡',
    title: 'Gallery',
    downLabel: 'Rest your eyes here',
    upLabel: 'Find your spark',
  },
  {
    to: '/journal',
    icon: '◈',
    title: 'Journal',
    downLabel: 'Let it out safely',
    upLabel: 'Capture this energy',
  },
  {
    to: '/quotes',
    icon: '❝',
    title: 'Quotes',
    downLabel: 'Words to ground you',
    upLabel: 'Words to move you',
  },
  {
    to: '/resources',
    icon: '♬',
    title: 'Listen',
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

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
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
