import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { YTTrack } from '../../hooks/useYoutubePlaylist'
import './PlaylistTracks.css'

interface Props {
  tracks: YTTrack[]
  loading: boolean
  error: string | null
  activeVideoId?: string
  onSelect: (track: YTTrack) => void
}

export function PlaylistTracks({ tracks, loading, error, activeVideoId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false)

  const visible = expanded ? tracks : tracks.slice(0, 8)

  if (loading) {
    return (
      <div className="playlist-tracks">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="playlist-track playlist-track--skeleton">
            <div className="skeleton playlist-track__thumb-skeleton" />
            <div className="playlist-track__info">
              <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 10, width: '35%', borderRadius: 4, marginTop: 6 }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="playlist-tracks__error">{error}</p>
  }

  if (tracks.length === 0) return null

  return (
    <div className="playlist-tracks">
      <p className="playlist-tracks__label">{tracks.length} tracks</p>

      <div className="playlist-tracks__scroll">
        <AnimatePresence initial={false}>
          {tracks.map((track, i) => {
            const isActive = track.videoId === activeVideoId
            return (
              <motion.button
                key={track.videoId}
                type="button"
                className={`playlist-track ${isActive ? 'playlist-track--active' : ''}`}
                onClick={() => onSelect(track)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeOut' }}
              >
                <span className="playlist-track__num">
                  {isActive ? '▶' : track.position + 1}
                </span>

                {track.thumbnail && (
                  <img
                    src={track.thumbnail}
                    alt=""
                    className="playlist-track__thumb"
                    loading="lazy"
                  />
                )}

                <div className="playlist-track__info">
                  <span className="playlist-track__title">{track.title}</span>
                  {track.channelTitle && (
                    <span className="playlist-track__artist">{track.channelTitle}</span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
