import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useFilm } from '../hooks/useFilm'
import { FilmGrid } from '../components/Film/FilmGrid'
import type { FilmItemType } from '../lib/supabase'
import './PageShared.css'
import './Film.css'

const TYPE_LABELS: Record<FilmItemType, string> = {
  still:  'Still',
  poster: 'Poster',
}

export default function Film() {
  const { mode } = useMode()
  const { items, loading } = useFilm(mode)
  const [activeTypes, setActiveTypes] = useState<FilmItemType[]>([])

  const filteredItems = activeTypes.length === 0
    ? items
    : items.filter(item => activeTypes.includes(item.type))

  const toggle = (type: FilmItemType) => {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const countFor = (type: FilmItemType) => items.filter(i => i.type === type).length
  const visibleTypes = (['still', 'poster'] as FilmItemType[]).filter(t => countFor(t) > 0)

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Film</h1>
        <p className="page__subtitle">
          {mode === 'down' ? 'Frames that stay with you.' : 'Scenes that move you.'}
        </p>
      </header>

      {visibleTypes.length > 0 && (
        <div className="film-filter">
          <motion.button
            className={`film-filter__chip ${activeTypes.length === 0 ? 'active' : ''}`}
            onClick={() => setActiveTypes([])}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            All
            <span className="film-filter__count">{items.length}</span>
          </motion.button>

          {visibleTypes.map(type => (
            <motion.button
              key={type}
              className={`film-filter__chip ${activeTypes.includes(type) ? 'active' : ''}`}
              onClick={() => toggle(type)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {TYPE_LABELS[type]}
              <span className="film-filter__count">{countFor(type)}</span>
            </motion.button>
          ))}
        </div>
      )}

      <FilmGrid items={filteredItems} loading={loading} />
    </motion.div>
  )
}
