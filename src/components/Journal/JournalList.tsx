import { motion } from 'framer-motion'
import type { JournalEntry } from '../../lib/supabase'
import './JournalList.css'

interface Props {
  entries: JournalEntry[]
  loading: boolean
}

export function JournalList({ entries, loading }: Props) {
  if (loading) {
    return (
      <div className="journal-list">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="journal-list__skeleton skeleton" />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="journal-list__empty">
        <p>Your entries will appear here.</p>
        <p>There's no wrong way to use this space.</p>
      </div>
    )
  }

  return (
    <div className="journal-list">
      {entries.map((entry, i) => (
        <motion.article
          key={entry.id}
          className="journal-list__entry"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
        >
          <div className="journal-list__entry-header">
            <time className="journal-list__time">
              {formatDate(entry.created_at)}
            </time>
            <span className={`journal-list__mode-tag mode--${entry.mode}`}>
              {entry.mode === 'down' ? '↓ calm' : '↑ energy'}
            </span>
          </div>
          <p className="journal-list__content">{entry.content}</p>
        </motion.article>
      ))}
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  if (days === 1) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}
