"use client";

import { Channel } from "@/data/channels";


export default function ChannelCard({ channel }: { channel : Channel }) {


  return (
    <button className="bg-blue-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
      {channel.name}
    </button>
  );
}
