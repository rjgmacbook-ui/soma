import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useQuotes } from '../hooks/useQuotes'
import type { Quote } from '../lib/supabase'
import './PageShared.css'
import './Quotes.css'

const FALLBACK_QUOTES: Quote[] = [
  { id: '1', text: 'You are allowed to be both a masterpiece and a work in progress.', author: 'Sophia Bush', mode: 'both', created_at: '' },
  { id: '2', text: 'Breathing in, I calm body and mind. Breathing out, I smile.', author: 'Thich Nhat Hanh', mode: 'down', created_at: '' },
  { id: '3', text: 'The present moment is the only moment available to us, and it is the door to all moments.', author: 'Thich Nhat Hanh', mode: 'both', created_at: '' },
  { id: '4', text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott', mode: 'down', created_at: '' },
  { id: '5', text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo', mode: 'up', created_at: '' },
  { id: '6', text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe', mode: 'up', created_at: '' },
  { id: '7', text: 'Rest is not idle, it is wisely spent.', author: undefined, mode: 'down', created_at: '' },
  { id: '8', text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time.', author: 'Hermann Hesse', mode: 'down', created_at: '' },
]

export default function Quotes() {
  const { mode } = useMode()
  const { quotes: fetched, loading } = useQuotes(mode)
  const quotes = fetched.length > 0 ? fetched : FALLBACK_QUOTES.filter(q => q.mode === mode || q.mode === 'both')

  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setFeaturedIdx(Math.floor(Math.random() * Math.max(quotes.length, 1)))
  }, [quotes.length])

  useEffect(() => {
    if (quotes.length === 0) return
    const id = setInterval(() => {
      setFeaturedIdx(i => (i + 1) % quotes.length)
      setKey(k => k + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [quotes.length])

  const featured = quotes[featuredIdx]

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Quotes</h1>
        <p className="page__subtitle">
          {mode === 'down' ? 'Words to ground you.' : 'Words to move you forward.'}
        </p>
      </header>

      {/* Featured quote */}
      {featured && (
        <div className="quotes-featured">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              className="quotes-featured__inner"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <span className="quotes-featured__mark">"</span>
              <blockquote className="quotes-featured__text">
                {featured.text}
              </blockquote>
              <span className="quotes-featured__mark quotes-featured__mark--close">"</span>
              {featured.author && (
                <cite className="quotes-featured__author">— {featured.author}</cite>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="quotes-featured__dots">
            {quotes.slice(0, Math.min(quotes.length, 8)).map((_, i) => (
              <button
                key={i}
                className={`quotes-featured__dot ${i === featuredIdx % Math.min(quotes.length, 8) ? 'active' : ''}`}
                onClick={() => { setFeaturedIdx(i); setKey(k => k + 1) }}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* All quotes list */}
      <section className="quotes-list">
        <h2 className="quotes-list__heading">All quotes</h2>

        {loading ? (
          <div className="quotes-list__items">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <div className="quotes-list__items">
            {quotes.map((q, i) => (
              <motion.div
                key={q.id}
                className={`quotes-list__item ${featuredIdx === i ? 'quotes-list__item--active' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onClick={() => { setFeaturedIdx(i); setKey(k => k + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                <p className="quotes-list__item-text">"{q.text}"</p>
                {q.author && <span className="quotes-list__item-author">— {q.author}</span>}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  )
}
