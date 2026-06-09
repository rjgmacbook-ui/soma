import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useGallery } from '../hooks/useGallery'
import { GalleryGrid } from '../components/Gallery/GalleryGrid'
import { GalleryFilter } from '../components/Gallery/GalleryFilter'
import type { GalleryItemType } from '../lib/supabase'
import './PageShared.css'

export default function Gallery() {
  const { mode } = useMode()
  const { items, loading } = useGallery(mode)
  const [activeTypes, setActiveTypes] = useState<GalleryItemType[]>([])

  const filteredItems = activeTypes.length === 0
    ? items
    : items.filter(item => activeTypes.includes(item.type))

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Gallery</h1>
        <p className="page__subtitle">
          {mode === 'down' ? 'Let beauty slow you down.' : 'Find what lights you up.'}
        </p>
      </header>

      <GalleryFilter
        items={items}
        activeTypes={activeTypes}
        onChange={setActiveTypes}
      />

      <GalleryGrid items={filteredItems} loading={loading} />
    </motion.div>
  )
}
