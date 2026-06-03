"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";

const streamUrls = [
  {
    name: "Test Channel",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
  },
  {
    name: "Test Channel 2",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8",
  },
  {
    name: "Test Channel 3",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8",
  },
  {
    name: "Test Channel 4",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
  },
];

export default function HomePage() {
  const [currentStream, setCurrentStream] = useState(streamUrls[0]);
  return (
    <div>
      <div>
        <VideoPlayer
          streamUrl={currentStream.url}
          streamType="hls"
          channelName="Test Channel"
        />
      </div>
      <div>
        {streamUrls.map((url, index) => (
          <button onClick={() => setCurrentStream(url)}>{url.name}</button>
        ))}
      </div>
    </div>
  );
}
