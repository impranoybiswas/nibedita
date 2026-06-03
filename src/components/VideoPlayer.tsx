"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

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
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (streamType === "dash") {
      setError("DASH stream — try a different source for this channel.");
      setLoading(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_: any, data: any) => {
        if (data.fatal) {
          setError("Stream load failed. The stream may be offline.");
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        setError("Stream load failed.");
        setLoading(false);
      });
    } else {
      setError("Your browser does not support HLS streaming.");
      setLoading(false);
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [streamUrl, streamType]);

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
          <p className="text-white font-semibold text-lg mb-1">
            Stream Unavailable
          </p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        autoPlay
        muted
      />
    </div>
  );
}
