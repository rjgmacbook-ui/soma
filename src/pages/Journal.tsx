import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import type { Mode } from '../lib/supabase'
import { useJournal } from '../hooks/useJournal'
import { JournalEntry } from '../components/Journal/JournalEntry'
import { JournalList } from '../components/Journal/JournalList'
import './PageShared.css'
import './Journal.css'

export default function Journal() {
  const { mode } = useMode() as { mode: Mode }
  const { entries, loading, saving, saveEntry } = useJournal()

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Journal</h1>
        <p className="page__subtitle">
          {mode === 'down'
            ? "No editing, no judgment. Just what's true right now."
            : "Channel this into words. Capture what's alive in you."}
        </p>
      </header>

      <div className="journal-page">
        <JournalEntry onSave={(content) => saveEntry(content, mode)} saving={saving} />

        {(entries.length > 0 || loading) && (
          <section className="journal-page__history">
            <h2 className="journal-page__history-title">Previous entries</h2>
            <JournalList entries={entries} loading={loading} />
          </section>
        )}
      </div>
    </motion.div>
  )
}
