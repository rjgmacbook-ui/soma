import { motion } from 'framer-motion'
import type { GalleryItem as GalleryItemType } from '../../lib/supabase'
import './GalleryItem.css'

interface Props {
  item: GalleryItemType
  onClick: () => void
  index: number
}

export function GalleryItemCard({ item, onClick, index }: Props) {
  return (
    <motion.button
      type="button"
      className="gallery-item"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="gallery-item__img-wrap">
        <img
          src={item.url}
          alt={item.title ?? 'gallery image'}
          className="gallery-item__img"
          loading="lazy"
        />
        <div className="gallery-item__overlay">
          <span className="gallery-item__type">{item.type}</span>
          {item.title && <span className="gallery-item__title">{item.title}</span>}
        </div>
      </div>
    </motion.button>
  )
}
