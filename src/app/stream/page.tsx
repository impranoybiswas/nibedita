"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HlsPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState(
    "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // ১. Browser jodi Hls.js support kore (Chrome, Firefox, Edge, etc.)
    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10, // Buffer performance optimize korar jonno
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("Autoplay blocked:", err));
      });
    }
    // ২. Browser jodi built-in HLS support kore (Jemon: Apple Safari)
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.log("Autoplay blocked:", err));
      });
    }

    // Component unmount hole cleanup korbe
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md my-6 text-black"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <video
        ref={videoRef}
        controls
        playsInline
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
          backgroundColor: "#000",
        }}
      />
    </div>
  );
}
