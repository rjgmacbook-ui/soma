import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import type { AudioResource } from '../../lib/supabase'
import { useYoutubePlaylist, type YTTrack } from '../../hooks/useYoutubePlaylist'
import { useYoutubePlayer } from '../../hooks/useYoutubePlayer'
import { PlaylistTracks } from './PlaylistTracks'
import './YoutubeEmbed.css'

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.searchParams.has('list') && !u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/videoseries?list=${u.searchParams.get('list')}&listType=playlist`
    }
    if (u.searchParams.has('v')) {
      const list = u.searchParams.get('list')
      const base = `https://www.youtube.com/embed/${u.searchParams.get('v')}`
      return list ? `${base}?list=${list}` : base
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    if (u.pathname.startsWith('/embed/')) return url
  } catch {
    return null
  }
  return null
}

interface Props {
  resource: AudioResource
  index: number
}

export function YoutubeEmbed({ resource, index }: Props) {
  const [activeTrack, setActiveTrack] = useState<YTTrack | null>(null)
  const { tracks, loading: tracksLoading, error, isPlaylist } = useYoutubePlaylist(resource.url)

  const activeIdx = activeTrack ? tracks.findIndex(t => t.videoId === activeTrack.videoId) : -1
  const hasPrev = activeIdx > 0
  const hasNext = activeIdx >= 0 && activeIdx < tracks.length - 1

  const goPrev = () => hasPrev && setActiveTrack(tracks[activeIdx - 1])
  const goNext = () => { if (hasNext) setActiveTrack(tracks[activeIdx + 1]) }

  const playerContainerRef = useRef<HTMLDivElement>(null)
  useYoutubePlayer(playerContainerRef, activeTrack?.videoId ?? null, goNext)

  const playlistEmbedUrl = resource.url ? toEmbedUrl(resource.url) : null

  return (
    <motion.div
      className="yt-embed"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    >
      <div className="yt-embed__header">
        <h3 className="yt-embed__title">{resource.title}</h3>
        {resource.description && (
          <p className="yt-embed__desc">{resource.description}</p>
        )}
      </div>

      {/* Active track: YT Player API (enables onEnded event) */}
      {activeTrack && (
        <div ref={playerContainerRef} className="yt-embed__player" />
      )}

      {/* Default: plain playlist iframe */}
      {!activeTrack && (
        playlistEmbedUrl ? (
          <div className="yt-embed__frame-wrap">
            <iframe
              src={playlistEmbedUrl}
              className="yt-embed__frame"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              title={resource.title}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="yt-embed__error">Could not parse YouTube URL.</div>
        )
      )}

      {activeTrack && (
        <div className="yt-embed__controls">
          <button
            className="yt-embed__ctrl-btn"
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous track"
          >
            ← Prev
          </button>
          <span className="yt-embed__now-playing">{activeTrack.title}</span>
          <button
            className="yt-embed__ctrl-btn"
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next track"
          >
            Next →
          </button>
        </div>
      )}

      {isPlaylist && (
        <PlaylistTracks
          tracks={tracks}
          loading={tracksLoading}
          error={error}
          activeVideoId={activeTrack?.videoId}
          onSelect={setActiveTrack}
        />
      )}
    </motion.div>
  )
}
