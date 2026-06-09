import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GalleryItem } from '../../lib/supabase'
import { GalleryItemCard } from './GalleryItem'
import { PlaceholderCard } from '../cards/PlaceholderCard'
import './GalleryGrid.css'

interface Props {
  items: GalleryItem[]
  loading: boolean
}

export function GalleryGrid({ items, loading }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [slideshowActive, setSlideshowActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') { setLightboxIdx(null); setSlideshowActive(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, goNext, goPrev])

  // Slideshow auto-advance
  useEffect(() => {
    if (!slideshowActive || !isOpen) return
    const id = setInterval(goNext, 5000)
    return () => clearInterval(id)
  }, [slideshowActive, isOpen, goNext])

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (loading) {
    return (
      <div className="gallery-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gallery-grid__skeleton skeleton" style={{ height: 160 + (i % 3) * 60 }} />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Toolbar */}
      {items.length > 0 && (
        <div className="gallery-toolbar">
          <button
            className={`gallery-toolbar__btn ${slideshowActive ? 'active' : ''}`}
            onClick={() => {
              if (!slideshowActive) {
                setLightboxIdx(0)
                setSlideshowActive(true)
              } else {
                setSlideshowActive(false)
                setLightboxIdx(null)
              }
            }}
          >
            {slideshowActive ? '⏹ Stop slideshow' : '▷ Slideshow'}
          </button>
          <button
            className={`gallery-toolbar__btn ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '⊡ Exit fullscreen' : '⊞ Fullscreen'}
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => { setImgDirection(1); setLightboxIdx(i) }}
          />
        ))}

        {items.length === 0 && (
          <>
            <PlaceholderCard label="Add wallpaper" delay={0} minHeight={200} />
            <PlaceholderCard label="Add album art" delay={0.08} minHeight={160} />
            <PlaceholderCard label="Add movie poster" delay={0.16} minHeight={240} />
            <PlaceholderCard label="Add sport photo" delay={0.24} minHeight={180} />
            <PlaceholderCard label="Add athlete photo" delay={0.32} minHeight={200} />
          </>
        )}

        {items.length > 0 && <PlaceholderCard label="Add image" delay={0} minHeight={160} />}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => { setLightboxIdx(null); setSlideshowActive(false) }}
          >
            <motion.div
              className="gallery-lightbox__content"
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
                  alt={current.title ?? ''}
                  className="gallery-lightbox__img"
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

              {current.title && (
                <p className="gallery-lightbox__title">{current.title}</p>
              )}

              {/* Counter */}
              {items.length > 1 && (
                <p className="gallery-lightbox__counter">
                  {(lightboxIdx ?? 0) + 1} / {items.length}
                </p>
              )}
            </motion.div>

            {/* Prev / Next */}
            {items.length > 1 && (
              <>
                <button
                  className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                  onClick={e => { e.stopPropagation(); goPrev() }}
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  className="gallery-lightbox__nav gallery-lightbox__nav--next"
                  onClick={e => { e.stopPropagation(); goNext() }}
                  aria-label="Next"
                >
                  →
                </button>
              </>
            )}

            {/* Controls row */}
            <div className="gallery-lightbox__controls">
              <button
                className={`gallery-lightbox__ctrl ${slideshowActive ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setSlideshowActive(s => !s) }}
              >
                {slideshowActive ? '⏹' : '▷'}
              </button>
              <button
                className="gallery-lightbox__close"
                onClick={() => { setLightboxIdx(null); setSlideshowActive(false) }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
