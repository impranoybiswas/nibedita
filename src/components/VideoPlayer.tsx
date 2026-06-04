"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  streamUrl: string;
  streamType: "hls" | "dash";
  channelName: string;
}

export default function VideoPlayer({
  streamUrl,
  streamType,
  channelName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Store the active HLS instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Adjust state during render when a new stream is selected
  // This avoids synchronous setState calls within useEffect
  const [prevStreamUrl, setPrevStreamUrl] = useState(streamUrl);
  if (streamUrl !== prevStreamUrl) {
    setPrevStreamUrl(streamUrl);
    setLoading(true);
    setError(null);
  }

  // Derive DASH error state to avoid synchronous state updates in effects
  const isDashUnsupported = streamType === "dash";
  const displayError = isDashUnsupported
    ? "DASH streams are not currently supported. Please try another source."
    : error;
  const displayLoading = isDashUnsupported ? false : loading;

  // Route every stream through the server-side proxy so that:
  //  1. HTTP streams are fetched server-side and served over HTTPS (mixed-content fix)
  //  2. Servers with restrictive CORS headers are proxied transparently
  const proxiedUrl = `/api/stream?url=${encodeURIComponent(streamUrl)}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isDashUnsupported) return;

    let cancelled = false;

    // Destroy any existing HLS instance before creating a new one
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Helper function for autoplay
    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Ignore autoplay restrictions
      }
    };

    // Dynamically import HLS.js to avoid SSR issues
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled || !videoRef.current) return;

        // Use HLS.js when supported
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
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

            console.error("HLS Fatal Error:", data);

            setError(
              "Unable to load the stream. The channel may currently be offline.",
            );

            setLoading(false);

            hls.destroy();
          });

          return;
        }

        // Safari and some browsers support HLS natively
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = proxiedUrl;

          const handleLoaded = async () => {
            setLoading(false);
            await playVideo();
          };

          const handleError = () => {
            setError("Failed to load the stream.");
            setLoading(false);
          };

          video.addEventListener("loadedmetadata", handleLoaded, {
            once: true,
          });

          video.addEventListener("error", handleError, {
            once: true,
          });

          return;
        }

        // Browser does not support HLS playback
        setError("Your browser does not support HLS streaming.");
        setLoading(false);
      })
      .catch((err) => {
        console.error("HLS Import Error:", err);

        if (!cancelled) {
          setError("Failed to initialize the video player.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [proxiedUrl, isDashUnsupported]);

  return (
    <div className="relative w-full h-full aspect-video overflow-hidden rounded-2xl bg-black">
      {displayLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="text-sm text-white/70">Loading {channelName}...</p>
        </div>
      )}

      {displayError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <div className="mb-3 text-4xl">📡</div>

          <h3 className="mb-1 text-lg font-semibold text-white">
            Stream Unavailable
          </h3>

          <p className="text-sm text-white/60">{displayError}</p>
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
  );
}
