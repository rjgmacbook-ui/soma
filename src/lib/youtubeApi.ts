let apiPromise: Promise<void> | null = null

export function loadYoutubeApi(): Promise<void> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<void>(resolve => {
    if (typeof window.YT !== 'undefined' && window.YT.Player) {
      resolve()
      return
    }

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })

  return apiPromise
}
