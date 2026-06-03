"use client";

import VideoPlayer from "@/components/VideoPlayer";

const STREAM_URL = "https://edge2.roarzone.net:8447/roarzone/edge5/disney-channel/index.m3u8?token=5a7c7963bc2f9db30d0107816687d611699401b2-82b369a3b11ad1f33cfb1e566ad49471-1780462508-1780451708";

export default function TVPlayerPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 font-mono">
      <VideoPlayer
        streamUrl={STREAM_URL}
        streamType="hls"
        channelName="Test Channel"
      />
    </main>
  );
}
