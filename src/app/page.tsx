"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import { channels } from "@/data/channels";
import Link from "next/link";

export default function HomePage() {
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [search, setSearch] = useState("");

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <main className="min-h-dvh bg-black/10 text-white border-x border-white/10">
      <section className="sticky top-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10">
        {/* Navbar */}
        <nav className="h-10 md:h-16 text-white flex items-end justify-center bg-gradient-to-b from-black/50 to-transparent">
          <Image
            src="/image/title.svg"
            alt="Logo"
            width={100}
            height={100}
            className="h-9 md:h-10 w-full"
          />
        </nav>

        {/* Player */}
        <div className="w-full mx-auto p-3">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <VideoPlayer
              streamUrl={currentChannel.streamUrl}
              streamType="hls"
              channelName={currentChannel.name}
            />
          </div>

          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 border border-white/10 p-2 rounded-2xl">
              <div className="relative size-8 md:size-10 bg-white rounded-full overflow-hidden flex items-center gap-2">
                <Image
                  src={currentChannel.logo}
                  alt={currentChannel.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <h2 className="font-bold text-sm md:text-lg pr-4">
                {currentChannel.name}
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-red-400 pr-1">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none backdrop-blur-md focus:border-blue-500"
          />
        </div>

        {/* Channels */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredChannels.map((channel) => {
            const active = currentChannel.id === channel.id;

            return (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 p-2 text-left ${
                  active
                    ? "bg-purple-800/60 border-purple-800/60 shadow-lg shadow-purple-800/20 scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-800/60"
                }
                `}
              >
                {active && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                      LIVE
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="bg-white rounded-xl p-2 h-20 w-20 flex items-center justify-center mb-3">
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="font-semibold text-sm line-clamp-2">
                    {channel.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      {/* Footer */}
      <footer className="h-14 mt-12 text-white flex items-center justify-center text-sm">
        Created by
        <Link
          className="font-semibold text-blue-500 ml-2"
          href="https://impranoybiswas.vercel.app"
        >
          Pranoy Biswas
        </Link>
      </footer>
    </main>
  );
}
