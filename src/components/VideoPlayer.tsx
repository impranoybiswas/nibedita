'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  streamUrl: string
  streamType: 'hls' | 'dash'
  channelName: string
}

export default function VideoPlayer({ streamUrl, streamType, channelName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setError(null)
    setLoading(true)

    // Destroy previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy?.()
      hlsRef.current = null
    }

    if (streamType === 'dash') {
      setError('DASH stream — এই channel এর অন্য source try করুন।')
      setLoading(false)
      return
    }

    let cancelled = false

    // ✅ Dynamic import — SSR এ load হয় না, তাই localStorage error নেই
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !videoRef.current) return

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false, lowLatencyMode: true })
        hlsRef.current = hls

        hls.loadSource(streamUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return
          setLoading(false)
          video.play().catch(() => {})
        })

        hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
          if (data.fatal) {
            setError('Stream load হয়নি। Channel টি এই মুহূর্তে offline থাকতে পারে।')
            setLoading(false)
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = streamUrl
        video.addEventListener('loadedmetadata', () => {
          setLoading(false)
          video.play().catch(() => {})
        }, { once: true })
        video.addEventListener('error', () => {
          setError('Stream load হয়নি।')
          setLoading(false)
        }, { once: true })
      } else {
        setError('আপনার browser HLS streaming support করে না।')
        setLoading(false)
      }
    }).catch(() => {
      if (!cancelled) {
        setError('Player load করতে সমস্যা হয়েছে।')
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      hlsRef.current?.destroy?.()
      hlsRef.current = null
    }
  }, [streamUrl, streamType])

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white/70 text-sm">Loading {channelName}...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 text-center p-6">
          <div className="text-4xl mb-3">📡</div>
          <p className="text-white font-semibold text-lg mb-1">Stream Unavailable</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      )}
      <video ref={videoRef} className="w-full h-full" controls playsInline autoPlay muted />
    </div>
  )
}
