import { useState, useEffect } from 'react'

export interface YTTrack {
  videoId: string
  title: string
  thumbnail: string
  channelTitle: string
  position: number
}

function extractPlaylistId(url: string): string | null {
  try {
    const u = new URL(url)
    return u.searchParams.get('list')
  } catch {
    return null
  }
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string

export function useYoutubePlaylist(url: string | undefined) {
  const [tracks, setTracks] = useState<YTTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const playlistId = url ? extractPlaylistId(url) : null

  useEffect(() => {
    if (!playlistId || !API_KEY) return

    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchAll() {
      const all: YTTrack[] = []
      let pageToken: string | undefined

      try {
        do {
          const params = new URLSearchParams({
            part: 'snippet',
            playlistId: playlistId!,
            maxResults: '50',
            key: API_KEY,
            ...(pageToken ? { pageToken } : {}),
          })

          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?${params}`
          )
          const data = await res.json()

          if (data.error) {
            setError(data.error.message)
            break
          }

          for (const item of data.items ?? []) {
            const s = item.snippet
            if (s.resourceId?.videoId) {
              all.push({
                videoId: s.resourceId.videoId,
                title: s.title,
                thumbnail: s.thumbnails?.medium?.url ?? s.thumbnails?.default?.url ?? '',
                channelTitle: s.videoOwnerChannelTitle ?? '',
                position: s.position,
              })
            }
          }

          pageToken = data.nextPageToken
        } while (pageToken && all.length < 200)

        if (!cancelled) setTracks(all)
      } catch (e) {
        if (!cancelled) setError('Failed to fetch playlist')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [playlistId])

  return { tracks, loading, error, isPlaylist: !!playlistId }
}
