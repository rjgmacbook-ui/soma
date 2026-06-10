import { motion } from 'framer-motion'
import type { FilmItem } from '../../lib/supabase'
import './FilmCard.css'

interface Props {
  item: FilmItem
  onClick: () => void
  index: number
}

export function FilmCard({ item, onClick, index }: Props) {
  return (
    <motion.button
      type="button"
      className="film-card"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="film-card__img-wrap">
        <img
          src={item.url}
          alt={item.name}
          className="film-card__img"
          loading="lazy"
        />
        <div className="film-card__overlay">
          <span className="film-card__type">{item.type}</span>
          <span className="film-card__name">{item.name}</span>
        </div>
      </div>
    </motion.button>
  )
}
