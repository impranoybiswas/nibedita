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
  const [volume, setVolume] = useState(1);
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
    }, 5000);
  };

  // Sync Volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("player-volume");
    if (savedVolume && videoRef.current) {
      const vol = Number(savedVolume);
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  }, []);

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
    if (nextMuted) setVolume(0);
    else {
      const lastVol = Number(localStorage.getItem("player-volume")) || 1;
      setVolume(lastVol);
      videoRef.current.volume = lastVol;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
    localStorage.setItem("player-volume", val.toString());
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
          className={`absolute inset-0 z-20 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black via-black/80 to-transparent p-5 ">
            <button
              onClick={togglePlay}
              className="text-white hover:scale-110 transition"
            >
              {isPlaying ? (
                <Pause fill="white" size={24} />
              ) : (
                <Play fill="white" size={24} />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:scale-110 transition"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w- cursor-pointer accent-red-500"
            />

            <div className="ml-auto flex items-center gap-4">
              {typeof document !== "undefined" &&
                "pictureInPictureEnabled" in document && (
                  <button
                    onClick={togglePiP}
                    className="text-white hover:scale-110 transition"
                  >
                    <PictureInPicture size={24} />
                  </button>
                )}

              <button
                onClick={toggleFullscreen}
                className="text-white hover:scale-110 transition"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>


      
    </>
  );
}
