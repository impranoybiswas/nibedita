"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import { channels } from "@/data/channels";
import Link from "next/link";
import { FilterIcon, Search } from "lucide-react";

export default function HomePage() {
  // --- States ---
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Channels");

  // --- Filter Logic ---
  // সার্চ ইনপুট এবং সিলেক্টেড ক্যাটাগরি দুইটোর উপর ভিত্তি করে চ্যানেল ফিল্টার হবে
  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(search.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All Channels" ||
        channel.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <main className="min-h-dvh max-w-3xl mx-auto bg-stone-950/20 text-white border-x border-white/5 shadow-2xl">
      
      {/* Sticky Header & Player Section */}
      <section className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        
        {/* Logo Header */}
        <header className="h-14 text-white flex items-center justify-center border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent">
          <Image
            src="/image/title.svg"
            alt="NibeditaTV Logo"
            width={140}
            height={40}
            className="h-7 md:h-8 w-auto object-contain"
            priority
          />
        </header>

        {/* Video Player Container */}
        <div className="w-full p-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
            <VideoPlayer
              streamUrl={currentChannel.streamUrl}
              streamType="hls"
              channelName={currentChannel.name}
            />
          </div>

          {/* Current Channel Meta Info */}
          <div className="flex items-center justify-between gap-3 mt-4 px-1">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md ">
              <div className="relative size-6 md:size-8 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-inner">
                <Image
                  src={currentChannel.logo}
                  alt={currentChannel.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="text-[6pt] font-bold text-purple-400 uppercase tracking-widest">
                  {currentChannel.category}
                </p>
                <h2 className="font-extrabold text-xs md:text-base pr-4 text-white/90 truncate max-w-[180px] md:max-w-xs">
                  {currentChannel.name}
                </h2>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-400 tracking-wider">LIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 py-6">
        
        {/* Controls: Search & Category Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search live channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm outline-none backdrop-blur-md transition focus:border-purple-500 focus:bg-white/10"
            />
            <Search size={16} className="absolute left-4 top-3.5 text-white/40 text-sm pointer-events-none" />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-white/80 outline-none backdrop-blur-md cursor-pointer transition focus:border-purple-500 focus:bg-white/10"
            >
              <option value="All Channels" className="bg-stone-900 text-white">All Channels</option>
              <option value="Bangla" className="bg-stone-900 text-white">Bangla</option>
              <option value="Sports" className="bg-stone-900 text-white">Sports</option>
              <option value="Entertainment" className="bg-stone-900 text-white">Entertainment</option>
            </select>
            {/* Custom Arrow Icon */}
            <FilterIcon size={16} className="absolute right-4 top-3.5 text-white/40 text-sm pointer-events-none" />
          </div>
        </div>

        {/* Channels Grid View */}
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filteredChannels.map((channel) => {
              const active = currentChannel.id === channel.id;

              return (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border p-3 text-center transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-b from-purple-600/40 to-purple-900/60 border-purple-500 shadow-lg shadow-purple-500/10 scale-[1.03]"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                  }`}
                >
                  {/* Channel Active Status Mark */}
                  {active && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}

                  {/* Channel Logo Frame */}
                  <div className="bg-white rounded-xl p-2.5 h-16 w-16 md:h-20 md:w-20 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>

                  {/* Channel Title Text */}
                  <h3 className={`font-medium text-xs md:text-sm line-clamp-1 px-1 transition-colors ${active ? "text-purple-200 font-bold" : "text-white/70 group-hover:text-white"}`}>
                    {channel.name}
                  </h3>
                </button>
              );
            })}
          </div>
        ) : (
          /* Empty / Not Found State */
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-xl">📺</p>
            <p className="text-sm text-white/40 mt-2">No channels found in this category.</p>
          </div>
        )}
      </section>

      {/* Modern Compact Footer */}
      <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-white/30 tracking-wide">
        Created by{" "}
        <Link
          className="font-semibold text-purple-400 hover:text-purple-300 transition"
          href="https://impranoybiswas.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pranoy Biswas
        </Link>
      </footer>
    </main>
  );
}