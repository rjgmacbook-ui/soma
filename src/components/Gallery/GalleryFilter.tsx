import { motion } from 'framer-motion'
import type { GalleryItem, GalleryItemType } from '../../lib/supabase'
import './GalleryFilter.css'

const ALL_TYPES: GalleryItemType[] = ['random', 'sport', 'film', 'tv', 'music', 'people']

const TYPE_LABELS: Record<GalleryItemType, string> = {
  random:  'Random',
  sport:   'Sport',
  film:    'Film',
  tv:      'TV',
  music:   'Music',
  people:  'People',
}

interface Props {
  items: GalleryItem[]
  activeTypes: GalleryItemType[]
  onChange: (types: GalleryItemType[]) => void
}

export function GalleryFilter({ items, activeTypes, onChange }: Props) {
  const countFor = (type: GalleryItemType) => items.filter(i => i.type === type).length
  const allActive = activeTypes.length === 0

  const toggle = (type: GalleryItemType) => {
    if (activeTypes.includes(type)) {
      const next = activeTypes.filter(t => t !== type)
      onChange(next)
    } else {
      onChange([...activeTypes, type])
    }
  }

  const visibleTypes = ALL_TYPES.filter(t => countFor(t) > 0)
  if (visibleTypes.length === 0) return null

  return (
    <div className="gallery-filter">
      <motion.button
        className={`gallery-filter__chip ${allActive ? 'active' : ''}`}
        onClick={() => onChange([])}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        All
        <span className="gallery-filter__count">{items.length}</span>
      </motion.button>

      {visibleTypes.map(type => {
        const count = countFor(type)
        const isActive = activeTypes.includes(type)
        return (
          <motion.button
            key={type}
            className={`gallery-filter__chip ${isActive ? 'active' : ''}`}
            onClick={() => toggle(type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {TYPE_LABELS[type]}
            <span className="gallery-filter__count">{count}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
