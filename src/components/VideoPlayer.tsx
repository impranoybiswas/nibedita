"use client";

import { useRef, useEffect } from "react";
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface VideoPlayerProps {
  url: string;
  type: "youtube" | "hls" | "video" | null;
}

export default function VideoPlayer({ url, type }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);

  const buildSrc = (videoUrl: string, videoType: typeof type) => {
    if (!videoType) return "";
    if (videoType === "youtube") return videoUrl;
    if (videoType === "hls")
      return { src: videoUrl, type: "application/x-mpegurl" };
    return videoUrl;
  };

  useEffect(() => {
    if (playerRef.current && url) {
      playerRef.current.startLoading();
    }
  }, [url]);

  return (
    <MediaPlayer
      ref={playerRef}
      src={buildSrc(url, type) as string}
      autoPlay
      playsInline
      className="w-full aspect-video"
      title="Video Player"
      crossOrigin
    >
      <MediaProvider />

      <DefaultVideoLayout icons={defaultLayoutIcons} smallLayoutWhen={false} />
    </MediaPlayer>
  );
}
