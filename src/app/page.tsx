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
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-900 text-white">
      <section className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        {/* Navbar */}
        <nav className="h-10 text-white flex items-end justify-center font-bold text-xl">
          <span className="text-blue-500">Nibedita</span>TV
        </nav>

        {/* Player */}

        <div className="max-w-7xl mx-auto p-3">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <VideoPlayer
              streamUrl={currentChannel.streamUrl}
              streamType="hls"
              channelName={currentChannel.name}
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="relative h-12 w-12 bg-white rounded-lg overflow-hidden">
              <Image
                src={currentChannel.logo}
                alt={currentChannel.name}
                fill
                className="object-contain p-1"
              />
            </div>

            <div>
              <h2 className="font-bold text-lg">{currentChannel.name}</h2>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-red-400">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-6">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredChannels.map((channel) => {
            const active = currentChannel.id === channel.id;

            return (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 text-left ${
                  active
                    ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/30 scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/40"
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
