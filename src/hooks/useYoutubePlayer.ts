import { useEffect, useRef, RefObject } from 'react'
import { loadYoutubeApi } from '../lib/youtubeApi'

export function useYoutubePlayer(
  containerRef: RefObject<HTMLDivElement | null>,
  videoId: string | null,
  onEnded: () => void
) {
  const playerRef = useRef<YT.Player | null>(null)
  const onEndedRef = useRef(onEnded)
  onEndedRef.current = onEnded

  // React to videoId changes — create player on first call, loadVideoById after
  useEffect(() => {
    if (!videoId) return

    let cancelled = false

    loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current) return

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId)
      } else {
        playerRef.current = new YT.Player(containerRef.current, {
          videoId,
          playerVars: { autoplay: 1, rel: 0 },
          events: {
            onStateChange: (e: YT.OnStateChangeEvent) => {
              if (e.data === YT.PlayerState.ENDED) {
                onEndedRef.current()
              }
            },
          },
        })
      }
    })

    return () => { cancelled = true }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Destroy player on unmount
  useEffect(() => {
    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])
}
