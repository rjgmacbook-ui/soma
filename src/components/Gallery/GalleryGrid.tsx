import { useState } from 'react'
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
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

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
      <div className="gallery-grid">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => setLightbox(item)}
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
        {lightbox && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="gallery-lightbox__content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.url}
                alt={lightbox.title ?? ''}
                className="gallery-lightbox__img"
              />
              {lightbox.title && (
                <p className="gallery-lightbox__title">{lightbox.title}</p>
              )}
            </motion.div>

            <button
              className="gallery-lightbox__close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
