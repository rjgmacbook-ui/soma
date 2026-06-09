import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Quote } from '../../lib/supabase'
import './QuoteCard.css'

const FALLBACK_QUOTES: Quote[] = [
  { id: '1', text: 'You are allowed to be both a masterpiece and a work in progress.', author: 'Sophia Bush', mode: 'both', created_at: '' },
  { id: '2', text: 'Breathing in, I calm body and mind. Breathing out, I smile.', author: 'Thich Nhat Hanh', mode: 'down', created_at: '' },
  { id: '3', text: 'The body keeps the score.', author: 'Bessel van der Kolk', mode: 'down', created_at: '' },
  { id: '4', text: 'You don\'t have to be positive all the time. It\'s perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.', author: 'Lori Deschene', mode: 'down', created_at: '' },
  { id: '5', text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo', mode: 'up', created_at: '' },
  { id: '6', text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe', mode: 'up', created_at: '' },
  { id: '7', text: 'The present moment is the only moment available to us, and it is the door to all moments.', author: 'Thich Nhat Hanh', mode: 'both', created_at: '' },
  { id: '8', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', mode: 'up', created_at: '' },
]

interface QuoteCardProps {
  quotes: Quote[]
}

export function QuoteCard({ quotes }: QuoteCardProps) {
  const pool = quotes.length > 0 ? quotes : FALLBACK_QUOTES
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * pool.length))
  const [key, setKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % pool.length)
      setKey(k => k + 1)
    }, 20000)
    return () => clearInterval(id)
  }, [pool.length])

  const quote = pool[idx] ?? pool[0]

  return (
    <div className="quote-card">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={key}
          className="quote-card__text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <span className="quote-card__mark">"</span>
          {quote.text}
          <span className="quote-card__mark">"</span>
        </motion.blockquote>
      </AnimatePresence>

      {quote.author && (
        <AnimatePresence mode="wait">
          <motion.cite
            key={`author-${key}`}
            className="quote-card__author"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            — {quote.author}
          </motion.cite>
        </AnimatePresence>
      )}

      <div className="quote-card__dots">
        {pool.slice(0, Math.min(pool.length, 6)).map((_, i) => (
          <button
            key={i}
            className={`quote-card__dot ${i === idx % Math.min(pool.length, 6) ? 'active' : ''}`}
            onClick={() => { setIdx(i); setKey(k => k + 1) }}
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
