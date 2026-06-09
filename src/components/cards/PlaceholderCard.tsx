import { motion } from 'framer-motion'
import './PlaceholderCard.css'

interface PlaceholderCardProps {
  label?: string
  delay?: number
  minHeight?: number
}

export function PlaceholderCard({ label = 'Add content', delay = 0, minHeight = 160 }: PlaceholderCardProps) {
  return (
    <motion.div
      className="placeholder-card"
      style={{ minHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="placeholder-card__inner">
        <span className="placeholder-card__plus">+</span>
        <span className="placeholder-card__label">{label}</span>
      </div>
    </motion.div>
  )
}
