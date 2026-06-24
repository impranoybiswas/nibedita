// page.tsx — Fixed Version
"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

import { channels, getCategories } from "@/data/channels";
import Link from "next/link";
import { ChevronDown, FilterIcon, Search, X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

export default function HomePage() {
  // --- Refs ---
  const playerRef = useRef<HTMLElement>(null);

  // --- States ---
  const [currentChannel, setCurrentChannel] = useState(() => {
    // if the user has a saved channel in localStorage, use that; otherwise default to the first channel
    if (typeof window !== "undefined") {
      const savedChannel = localStorage.getItem("current-channel");
      if (savedChannel) {
        return channels.find((c) => c.id === savedChannel) || channels[0];
      }
    }
    return channels[0]; // fallback to first channel or null if channels is empty
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- Filter Logic ---
  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        channel.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // --- Channel Select Handler: scroll to player on mobile ---
  const handleSelectChannel = (channel: (typeof channels)[0]) => {
    setCurrentChannel(channel);
    localStorage.setItem("current-channel", channel.id); // persist selected channel
    // Smooth scroll to player on mobile
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Clear all filters ---
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = search !== "" || selectedCategory !== "all";

  // --- Helper: Build proxied URL ---
  const getProxiedUrl = (url: string) => {
    if (!url) return "";
    return `/api/stream?url=${encodeURIComponent(url)}`;
  };

  return (
    <main className="min-h-dvh max-w-md mx-auto bg-stone-950/20 text-white border-x border-white/5 shadow-2xl grid grid-cols-1">
      {/* Sticky Header & Player Section */}
      <section
        ref={playerRef}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10 col-span-1"
      >
        {/* Logo Header */}
        <header className="h-14 text-white flex items-center justify-center border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent">
          <Link href="/">
            <Image
              src="/image/title.svg"
              alt="NibeditaTV Logo"
              width={140}
              height={40}
              className="h-7 md:h-8 w-auto object-contain"
              priority
            />
          </Link>
        </header>

        {/* Video Player Container */}
        <div className="w-full p-4 shadow-2xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
            <VideoPlayer
              url={getProxiedUrl(currentChannel.streamUrl)}
              type="hls"
            />
          </div>

          {/* Current Channel Meta Info */}
          <div className="flex items-center justify-between gap-3 mt-4 px-1">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
              <div className="relative size-6 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-inner">
                <Image
                  src={currentChannel.logo}
                  alt={currentChannel.name}
                  fill
                  className="object-contain p-1"
                  priority // FIX: active channel logo always priority
                />
              </div>
              <div>
                {/* FIX: capitalize category label for display */}
                <p className="text-[6pt] font-bold text-purple-400 uppercase tracking-widest">
                  {currentChannel.category}
                </p>
                <h2 className="font-extrabold text-xs pr-4 text-white/90 truncate max-w-[180px] md:max-w-xs">
                  {currentChannel.name}
                </h2>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-400 tracking-wider">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 py-6 ">
        {/* Controls: Search & Category Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search live channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 pr-10 text-sm outline-none backdrop-blur-md transition focus:border-purple-500 focus:bg-white/10"
            />
            <Search
              size={16}
              className="absolute left-4 top-3.5 text-white/40 pointer-events-none"
            />
            {/* FIX: clear search button */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-white/30 hover:text-white/70 transition"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Dropdown Filter */}
          {/* FIX: value matches channel.category directly; options derived dynamically */}
          <div className="relative min-w-[160px] uppercase">
            <FilterIcon
              className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              size={16}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 pr-10 text-sm font-medium text-white/80 outline-none backdrop-blur-md cursor-pointer transition focus:border-purple-500 focus:bg-white/10 uppercase"
            >
              {/* "All" option */}
              <option value="all" className="bg-stone-900 text-white">
                All Channels
              </option>
              {/* FIX: dynamically generated from channels data */}
              {getCategories().map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-stone-900 text-white"
                >
                  {/* Capitalize first letter for display */}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {/* FIX: ChevronDown as dropdown arrow (semantically correct) */}
            <ChevronDown
              size={15}
              className="absolute right-3 top-3.5 text-white/40 pointer-events-none"
            />
          </div>
        </div>

        {/* Channels Grid View */}
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredChannels.map((channel) => {
              const active = currentChannel.id === channel.id;

              return (
                <button
                  key={channel.id}
                  onClick={() => handleSelectChannel(channel)}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border p-3 text-center transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-b from-purple-600/40 to-purple-900/60 border-purple-500 shadow-lg shadow-purple-500/10 scale-[1.03]"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                  }`}
                >
                  {/* Active Status Dot */}
                  {active && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}

                  {/* Channel Logo */}
                  <div className="bg-white rounded-xl p-2.5 h-16 w-16 md:h-20 md:w-20 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={64}
                      height={64}
                      className="object-contain"
                      // FIX: priority on currently active channel for LCP
                      priority={channel.id === currentChannel.id}
                    />
                  </div>

                  {/* Channel Name */}
                  <h3
                    className={`font-medium text-xs md:text-sm line-clamp-1 px-1 transition-colors ${
                      active
                        ? "text-purple-200 font-bold"
                        : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {channel.name}
                  </h3>
                </button>
              );
            })}
          </div>
        ) : (
          /* FIX: Empty state with clear filters button */
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-2xl mb-2">📺</p>
            <p className="text-sm text-white/50 mb-1">
              No channels found for{" "}
              {search ? `"${search}"` : `"${selectedCategory}"`}
            </p>
            <p className="text-xs text-white/30 mb-5">
              Try a different search or category
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 border border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 px-4 py-2 rounded-full transition"
              >
                <X size={13} />
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
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
