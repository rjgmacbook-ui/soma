import { motion } from 'framer-motion'
import type { AudioResource } from '../../lib/supabase'
import './AudioCard.css'

const TYPE_ICONS: Record<AudioResource['type'], string> = {
  playlist: '♪',
  score: '♬',
  ambient: '∿',
  album: '◉',
}

interface Props {
  resource: AudioResource
  index: number
}

export function AudioCard({ resource, index }: Props) {
  return (
    <motion.a
      href={resource.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="audio-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="audio-card__icon">{TYPE_ICONS[resource.type]}</div>

      <div className="audio-card__body">
        <h3 className="audio-card__title">{resource.title}</h3>
        {resource.description && (
          <p className="audio-card__desc">{resource.description}</p>
        )}
      </div>

      <div className="audio-card__meta">
        <span className="audio-card__type">{resource.type}</span>
        {resource.url && <span className="audio-card__arrow">↗</span>}
      </div>
    </motion.a>
  )
}
