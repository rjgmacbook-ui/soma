import { motion } from 'framer-motion'
import type { AudioResource } from '../../lib/supabase'
import './YoutubeEmbed.css'

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // Playlist: youtube.com/playlist?list=...
    if (u.searchParams.has('list') && !u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/videoseries?list=${u.searchParams.get('list')}&listType=playlist`
    }
    // Watch with playlist
    if (u.searchParams.has('v')) {
      const list = u.searchParams.get('list')
      const base = `https://www.youtube.com/embed/${u.searchParams.get('v')}`
      return list ? `${base}?list=${list}` : base
    }
    // youtu.be short link
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    // Already an embed URL
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
  const embedUrl = resource.url ? toEmbedUrl(resource.url) : null

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

      {embedUrl ? (
        <div className="yt-embed__frame-wrap">
          <iframe
            src={embedUrl}
            className="yt-embed__frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={resource.title}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="yt-embed__error">
          Could not parse YouTube URL.
        </div>
      )}
    </motion.div>
  )
}
