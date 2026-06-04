"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  streamUrl: string;
  streamType: "hls" | "dash";
  channelName: string;
}

interface Hls {
  destroy(): void;
  loadSource(source: string): void;
  attachMedia(media: HTMLMediaElement): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

export default function VideoPlayer({
  streamUrl,
  streamType,
  channelName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDash = streamType === "dash";
  const proxiedUrl = `/api/stream?url=${encodeURIComponent(streamUrl)}`;

  // Reset state during render when stream changes (avoids synchronous setState in effect)
  const [prevProxiedUrl, setPrevProxiedUrl] = useState(proxiedUrl);
  if (proxiedUrl !== prevProxiedUrl) {
    setPrevProxiedUrl(proxiedUrl);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isDash) return;

    let cancelled = false;

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Clear native video callbacks to avoid stale handlers
      video.onloadedmetadata = null;
      video.onerror = null;

      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // autoplay block ignore
      }
    };

    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled || !videoRef.current) return;

        // Native HLS (Safari fallback)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = proxiedUrl;

          video.onloadedmetadata = async () => {
            setLoading(false);
            await playVideo();
          };

          video.onerror = () => {
            setError("Failed to load stream.");
            setLoading(false);
          };

          return;
        }

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 60,
          });

          hlsRef.current = hls;

          hls.loadSource(proxiedUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            if (cancelled) return;
            setLoading(false);
            await playVideo();
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (!data.fatal) return;

            console.error("HLS Error:", data);

            setError(
              "Stream unavailable. Channel may be offline or restricted.",
            );
            setLoading(false);

            hls.destroy();
          });

          return;
        }

        setError("HLS not supported in this browser.");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Player initialization failed.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [proxiedUrl, isDash]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="mt-2 text-sm text-white/70">Loading {channelName}...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-center p-4">
          <div className="text-4xl">📡</div>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Stream Error
          </h2>
          <p className="text-sm text-white/60">{error}</p>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        autoPlay
      />
    </div>
  );
}
