"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import ControlBtn from "./ControlBtn";

interface VideoPlayerProps {
  streamUrl: string;
  streamType: "hls" | "dash";
  channelName: string;
}

interface HlsInstance {
  destroy(): void;
  loadSource(source: string): void;
  attachMedia(media: HTMLMediaElement): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer({
  streamUrl,
  streamType,
  channelName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<HlsInstance | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekbarRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [skipFeedback, setSkipFeedback] = useState<
    "forward" | "backward" | null
  >(null);

  const isDash = streamType === "dash";
  const isLive = !isFinite(duration) || duration === 0;
  const proxiedUrl = `/api/stream?url=${encodeURIComponent(streamUrl)}`;

  // ─── Controls auto-hide ───────────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  }, []);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  // ─── HLS init ─────────────────────────────────────────────────────────────
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
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(proxiedUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return;
          setLoading(false);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
          if (data.fatal) {
            setError("Stream unavailable or offline.");
            setLoading(false);
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
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

  // ─── Video event listeners ─────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      scheduleHide();
    };
    const onPause = () => {
      setIsPlaying(false);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
    };

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(video.currentTime);
      // buffered
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const onDurationChange = () => {
      setDuration(video.duration);
    };

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [isDragging, scheduleHide]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {
        /* ignore */
      });
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement)
        await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch (e) {
      console.error("PiP failed", e);
    }
  };

  const skip = (seconds: number) => {
    const v = videoRef.current;
    if (!v || isLive) return;
    v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), duration);
    setSkipFeedback(seconds > 0 ? "forward" : "backward");
    setTimeout(() => setSkipFeedback(null), 600);
  };

  // ─── Seekbar handlers ─────────────────────────────────────────────────────
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleSeekStart = () => setIsDragging(true);

  const handleSeekEnd = () => {
    const v = videoRef.current;
    const input = seekbarRef.current;
    if (v && input) v.currentTime = Number(input.value);
    setIsDragging(false);
  };

  const seekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={revealControls}
      onMouseLeave={() => isPlaying && scheduleHide()}
      onTouchStart={revealControls}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black select-none"
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        playsInline
        autoPlay
      />

      {/* Skip feedback flash */}
      {skipFeedback && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div
            className={`flex flex-col items-center gap-1 rounded-xl bg-black/50 px-6 py-4 text-white animate-ping-once`}
          >
            {skipFeedback === "forward" ? (
              <RotateCw size={32} />
            ) : (
              <RotateCcw size={32} />
            )}
            <span className="text-sm font-semibold">
              {skipFeedback === "forward" ? "+10s" : "-10s"}
            </span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="mt-3 text-sm text-white/60">Loading {channelName}...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-4 text-center">
          <div className="text-5xl">📡</div>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Stream Error
          </h2>
          <p className="mt-1 text-sm text-white/50">{error}</p>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar: channel name */}
        <div className="bg-gradient-to-b from-black/70 to-transparent px-5 pt-4 pb-8">
          <p className="text-sm font-semibold text-white/90 tracking-wide">
            {channelName}
          </p>
          {isLive && (
            <span className="mt-1 inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Bottom bar */}
        <div className="w-full px-4 pb-4 bg-linear-to-t from-black/70 to-transparent h-fit">
          {/* Seek bar — only for VOD */}
          {!isLive && (
            <div className="relative mb-3 flex items-center">
              {/* Buffered track */}
              <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white/40 transition-all"
                  style={{ width: `${bufferedPercent}%` }}
                />
              </div>
              {/* Progress track */}
              <div
                className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-purple-500 pointer-events-none"
                style={{ width: `${seekPercent}%` }}
              />
              <input
                ref={seekbarRef}
                type="range"
                min={0}
                max={duration || 0}
                step={0.5}
                value={currentTime}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="relative w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-translate-y-1.5"
              />
            </div>
          )}

          {/* Button row */}
          <div className="flex items-center justify-evenly gap-1.5 md:gap-2">
            {/* Play/Pause */}
            <ControlBtn
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause fill="white" size={18} />
              ) : (
                <Play fill="white" size={18} />
              )}
            </ControlBtn>

            {/* Skip back — VOD only */}
            {!isLive && (
              <ControlBtn onClick={() => skip(-10)} aria-label="Rewind 10s">
                <RotateCcw size={16} />
              </ControlBtn>
            )}

            {/* Skip forward — VOD only */}
            {!isLive && (
              <ControlBtn onClick={() => skip(10)} aria-label="Forward 10s">
                <RotateCw size={16} />
              </ControlBtn>
            )}

            {/* Mute */}
            <ControlBtn
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </ControlBtn>

            {/* Time display — VOD only */}
            {!isLive && (
              <span className="ml-1 text-[8pt] md:text-sm tabular-nums text-white/70 hidden">
                {formatTime(currentTime)}
                <span className="mx-1 text-white/30">/</span>
                {formatTime(duration)}
              </span>
            )}

            <div className="bg-transparent w-full h-10" />

            {typeof document !== "undefined" &&
              "pictureInPictureEnabled" in document && (
                <ControlBtn onClick={togglePiP} aria-label="Picture in Picture">
                  <PictureInPicture size={16} />
                </ControlBtn>
              )}
            <ControlBtn
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </ControlBtn>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-2"></div>
          </div>
        </div>
      </div>

      {/* Click center to play/pause */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 z-10 h-full w-full"
        aria-label="Toggle play"
        tabIndex={-1}
      />

      <style>{`
        @keyframes ping-once {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        .animate-ping-once { animation: ping-once 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
