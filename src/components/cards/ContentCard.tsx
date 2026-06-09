import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import './ContentCard.css'

interface ContentCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  delay?: number
  href?: string
}

const hoverAnim = { scale: 1.02 }
const cardTransition = { duration: 0.5, ease: 'easeOut' as const }

export function ContentCard({ children, className = '', onClick, delay = 0, href }: ContentCardProps) {
  const transition = { ...cardTransition, delay }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`content-card ${className}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        whileHover={hoverAnim}
      >
        {children}
      </motion.a>
    )
  }

  if (onClick) {
    return (
      <motion.button
        type="button"
        className={`content-card ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        whileHover={hoverAnim}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <motion.div
      className={`content-card ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      whileHover={hoverAnim}
    >
      {children}
    </motion.div>
  )
}
