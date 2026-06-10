import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FilmItem } from '../../lib/supabase'
import { FilmCard } from './FilmCard'
import './FilmGrid.css'

interface Props {
  items: FilmItem[]
  loading: boolean
}

export function FilmGrid({ items, loading }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [imgDirection, setImgDirection] = useState(1)

  const isOpen = lightboxIdx !== null
  const current = lightboxIdx !== null ? items[lightboxIdx] : null

  const goTo = useCallback((idx: number, dir: number) => {
    setImgDirection(dir)
    setLightboxIdx(idx)
  }, [])

  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return
    goTo((lightboxIdx - 1 + items.length) % items.length, -1)
  }, [lightboxIdx, items.length, goTo])

  const goNext = useCallback(() => {
    if (lightboxIdx === null) return
    goTo((lightboxIdx + 1) % items.length, 1)
  }, [lightboxIdx, items.length, goTo])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, goNext, goPrev])

  if (loading) {
    return (
      <div className="film-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="film-grid__skeleton skeleton" style={{ height: 180 + (i % 3) * 60 }} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="film-grid__empty">
        Add stills and posters to the <code>film_items</code> table in Supabase — they'll appear here.
      </p>
    )
  }

  return (
    <>
      <div className="film-grid">
        {items.map((item, i) => (
          <FilmCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => { setImgDirection(1); setLightboxIdx(i) }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            className="film-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIdx(null)}
          >
            <motion.div
              className="film-lightbox__content"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" custom={imgDirection}>
                <motion.img
                  key={current.id}
                  src={current.url}
                  alt={current.name}
                  className="film-lightbox__img"
                  custom={imgDirection}
                  variants={{
                    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
                    center: { opacity: 1, x: 0 },
                    exit: (dir: number) => ({ opacity: 0, x: -dir * 60 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              <div className="film-lightbox__meta">
                <span className="film-lightbox__type">{current.type}</span>
                <p className="film-lightbox__name">{current.name}</p>
              </div>

              {items.length > 1 && (
                <p className="film-lightbox__counter">
                  {(lightboxIdx ?? 0) + 1} / {items.length}
                </p>
              )}
            </motion.div>

            {items.length > 1 && (
              <>
                <button
                  className="film-lightbox__nav film-lightbox__nav--prev"
                  onClick={e => { e.stopPropagation(); goPrev() }}
                  aria-label="Previous"
                >←</button>
                <button
                  className="film-lightbox__nav film-lightbox__nav--next"
                  onClick={e => { e.stopPropagation(); goNext() }}
                  aria-label="Next"
                >→</button>
              </>
            )}

            <button
              className="film-lightbox__close"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
