"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { streams } from "@/data/stream";
import React, { useState } from "react";

export default function StreamPage() {
  const [streamUrl, setStreamUrl] = useState(streams[0].url);
  return (
    <div className="max-w-7xl mx-auto p-3 space-y-3">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <VideoPlayer streamUrl={streamUrl} streamType="hls" channelName={""} />
      </div>
      <div>
        <input
          type="text"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
        />
        <button onClick={() => setStreamUrl(streamUrl)}>Play</button>
      </div>
      <div className="flex items-center gap-3">
        {streams.map((stream) => (
          <button className="p-2 border border-white/20" key={stream.id} onClick={() => setStreamUrl(stream.url)}>
            {stream.name}
          </button>
        ))}
      </div>
    </div>
  );
}
