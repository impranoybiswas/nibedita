"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
} from "lucide-react";

interface VideoPlayerProps {
  streamUrl: string;
  streamType: "hls" | "dash";
  channelName: string;
}

// HLS interface declaration
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
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const proxiedUrl = `/api/stream?url=${encodeURIComponent(streamUrl)}`;
  const isDash = streamType === "dash";

  // Handle Controls visibility
  const showPlayerControls = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 1000);
  };

  // HLS and Video Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isDash) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !videoRef.current) return;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(proxiedUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return;
          setLoading(false);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setError("Stream unavailable or offline.");
            setLoading(false);
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native support
        video.src = proxiedUrl;
        video.onloadedmetadata = () => {
          setLoading(false);
          video.play().catch(() => {});
        };
      } else {
        setError("Your browser does not support HLS playback.");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [proxiedUrl, isDash]);

  // Video Event Listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Actions
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP failed", err);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={showPlayerControls}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
      >
        {/* Actual Video Element */}
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          playsInline
          autoPlay
        />

        {/* Loading Overlay */}
        {loading && !error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
            <p className="mt-2 text-sm text-white/70">
              Loading {channelName}...
            </p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 text-center p-4">
            <div className="text-4xl">📡</div>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Stream Error
            </h2>
            <p className="text-sm text-white/60">{error}</p>
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={`absolute z-20 bottom-5 left-1/2 -translate-x-1/2  transition-all w-2/3 border border-white/20 duration-300 rounded-full bg-black/5 ${showControls ? "opacity-100" : "opacity-0"} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2 to-transparent p-2">
            <button
              onClick={togglePlay}
              className="text-white hover:scale-110 transition rounded-full size-10 flex items-center justify-center bg-black/30"
            >
              {isPlaying ? (
                <Pause fill="white" size={20} />
              ) : (
                <Play fill="white" size={20} />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:scale-110 transition rounded-full size-10 flex items-center justify-center bg-black/30"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div className="ml-auto flex items-center gap-3">
              {typeof document !== "undefined" &&
                "pictureInPictureEnabled" in document && (
                  <button
                    onClick={togglePiP}
                    className="text-white hover:scale-110 transition rounded-full size-10 flex items-center justify-center bg-black/30"
                  >
                    <PictureInPicture size={20} />
                  </button>
                )}

              <button
                onClick={toggleFullscreen}
                className="text-white hover:scale-110 transition rounded-full size-10 flex items-center justify-center bg-black/30"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
