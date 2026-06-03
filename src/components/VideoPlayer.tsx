'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  streamUrl: string
  streamType: 'hls' | 'dash'
  channelName: string
}

export default function VideoPlayer({
  streamUrl,
  streamType,
  channelName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Store the active HLS instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    let cancelled = false

    setLoading(true)
    setError(null)

    // Destroy any existing HLS instance before creating a new one
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    // Helper function for autoplay
    const playVideo = async () => {
      try {
        await video.play()
      } catch {
        // Ignore autoplay restrictions
      }
    }

    // DASH playback is currently not supported
    if (streamType === 'dash') {
      setError(
        'DASH streams are not currently supported. Please try another source.'
      )
      setLoading(false)
      return
    }

    // Dynamically import HLS.js to avoid SSR issues
    import('hls.js')
      .then(({ default: Hls }) => {
        if (cancelled || !videoRef.current) return

        // Use HLS.js when supported
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          })

          hlsRef.current = hls

          hls.loadSource(streamUrl)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            if (cancelled) return

            setLoading(false)
            await playVideo()
          })

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (!data.fatal) return

            console.error('HLS Fatal Error:', data)

            setError(
              'Unable to load the stream. The channel may currently be offline.'
            )

            setLoading(false)

            hls.destroy()
          })

          return
        }

        // Safari and some browsers support HLS natively
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl

          const handleLoaded = async () => {
            setLoading(false)
            await playVideo()
          }

          const handleError = () => {
            setError('Failed to load the stream.')
            setLoading(false)
          }

          video.addEventListener('loadedmetadata', handleLoaded, {
            once: true,
          })

          video.addEventListener('error', handleError, {
            once: true,
          })

          return
        }

        // Browser does not support HLS playback
        setError('Your browser does not support HLS streaming.')
        setLoading(false)
      })
      .catch((err) => {
        console.error('HLS Import Error:', err)

        if (!cancelled) {
          setError('Failed to initialize the video player.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true

      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [streamUrl, streamType])

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-black">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="text-sm text-white/70">
            Loading {channelName}...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <div className="mb-3 text-4xl">📡</div>

          <h3 className="mb-1 text-lg font-semibold text-white">
            Stream Unavailable
          </h3>

          <p className="text-sm text-white/60">
            {error}
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        className="h-full w-full shadow-2xl"
        controls
        playsInline
        autoPlay
        muted={false}
  
      />
    </div>
  )
}