import { motion } from 'framer-motion'
import { useMode } from '../contexts/ModeContext'
import { useAudioResources } from '../hooks/useQuotes'
import { YoutubeEmbed } from '../components/Audio/YoutubeEmbed'
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

      {loading ? (
        <div className="resources-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <p className="resources-empty">
          Add YouTube videos or playlists to the <code>audio_resources</code> table in Supabase — they'll appear here.
        </p>
      ) : (
        <div className="resources-list">
          {resources.map((r, i) => (
            <YoutubeEmbed key={r.id} resource={r} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
