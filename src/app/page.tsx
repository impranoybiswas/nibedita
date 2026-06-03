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
  {
    name: "Test Channel 5",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8",
  },
  {
    name: "Test Channel 6",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8",
  },
  {
    name: "Test Channel 7",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8",
  },
  {
    name: "Test Channel 8",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
  },
  {
    name: "Test Channel 9",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8",
  },
  {
    name: "Test Channel 10",
    url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8",
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
      <div className="flex flex-wrap gap-3 items-center">
        {streamUrls.map((url, index) => (
          <button className={`bg-blue-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors ${currentStream.url === url.url ? "bg-blue-600" : ""}`} key={url.url} onClick={() => setCurrentStream(url)}>{url.name}</button>
        ))}
      </div>
    </div>
  );
}
