import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function Home() {
  const { mode } = useMode()
  const now = useClock()

  const hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  const hours12 = (hours % 12 || 12).toString()
  const dayName = DAYS[now.getDay()]
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  const greeting =
    hours < 5 ? 'Still night.' :
    hours < 12 ? 'Good morning.' :
    hours < 17 ? 'Good afternoon.' :
    hours < 21 ? 'Good evening.' : 'Late night.'

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Clock */}
      <motion.div
        className="home__clock"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="home__clock-time">
          <span className="home__clock-hours">{hours12}</span>
          <span className="home__clock-sep">:</span>
          <span className="home__clock-minutes">{minutes}</span>
          <span className="home__clock-sep home__clock-sep--sm">:</span>
          <span className="home__clock-seconds">{seconds}</span>
          <span className="home__clock-ampm">{ampm}</span>
        </div>
        <div className="home__clock-meta">
          <span className="home__clock-day">{dayName}</span>
          <span className="home__clock-dot">·</span>
          <span className="home__clock-date">{dateStr}</span>
        </div>
        <p className="home__clock-greeting">{greeting}</p>
      </motion.div>

      {/* Nav cards — 2-column grid */}
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
              <h3 className="home__nav-title">{card.title}</h3>
              <p className="home__nav-desc">
                {mode === 'down' ? card.downLabel : card.upLabel}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  )
}
