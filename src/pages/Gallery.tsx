import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useGallery } from '../hooks/useGallery'
import { GalleryGrid } from '../components/Gallery/GalleryGrid'
import './PageShared.css'

export default function Gallery() {
  const { mode } = useMode()
  const { items, loading } = useGallery(mode)

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
          {mode === 'down'
            ? 'Let beauty slow you down.'
            : 'Find what lights you up.'}
        </p>
      </header>

      <GalleryGrid items={items} loading={loading} />
    </motion.div>
  )
}
