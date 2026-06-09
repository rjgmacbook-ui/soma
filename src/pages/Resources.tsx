import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useAudioResources } from '../hooks/useQuotes'
import { AudioCard } from '../components/Audio/AudioCard'
import { PlaceholderCard } from '../components/cards/PlaceholderCard'
import './PageShared.css'
import './Resources.css'

export default function Resources() {
  const { mode } = useMode()
  const { resources, loading } = useAudioResources(mode)

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page__header">
        <h1 className="page__title">Listen</h1>
        <p className="page__subtitle">
          {mode === 'down'
            ? 'Sound can reach where words cannot.'
            : 'Let the music move you forward.'}
        </p>
      </header>

      <div className="resources-page">
        {loading ? (
          <div className="resources-page__list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <div className="resources-page__list">
            {resources.map((r, i) => (
              <AudioCard key={r.id} resource={r} index={i} />
            ))}

            {resources.length === 0 && (
              <div className="resources-page__empty">
                <p>Add your favorite playlists, scores, and ambient mixes to Supabase.</p>
                <p>They'll appear here, filtered for your current mode.</p>
              </div>
            )}

            <PlaceholderCard label="Add audio resource" delay={0.1} minHeight={80} />
          </div>
        )}

        {/* Placeholder sections for future content */}
        <section className="resources-page__section">
          <h2 className="resources-page__section-title">More resources</h2>
          <div className="resources-page__placeholder-grid">
            <PlaceholderCard label="Add podcast" delay={0.1} minHeight={120} />
            <PlaceholderCard label="Add meditation" delay={0.18} minHeight={120} />
            <PlaceholderCard label="Add soundscape" delay={0.26} minHeight={120} />
          </div>
        </section>
      </div>
    </motion.div>
  )
}
