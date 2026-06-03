'use client'

import { useState, useMemo } from 'react'
import { channels } from '@/data/channels'
import ChannelCard from '@/components/ChannelCard'

const ALL_GROUPS = ['All', 'Bangla', 'News', 'Indian', 'Sports', 'Movies', 'Music', 'Kids', 'Documentary', 'Religious', 'Live']

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState('All')

  const filtered = useMemo(() => {
    return channels.filter((ch) => {
      const matchGroup = activeGroup === 'All' || ch.group === activeGroup
      const matchSearch = ch.name.toLowerCase().includes(search.toLowerCase())
      return matchGroup && matchSearch
    })
  }, [search, activeGroup])

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { All: channels.length }
    for (const ch of channels) {
      counts[ch.group] = (counts[ch.group] ?? 0) + 1
    }
    return counts
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          🇧🇩 Bangladesh Live TV
        </h1>
        <p className="text-white/40 text-sm">{channels.length} channels available • Free & Live</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {ALL_GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeGroup === group
                ? 'bg-red-500 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {group}
            <span className="ml-1.5 opacity-60">({groupCounts[group] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Channel Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-5xl mb-4">📺</div>
          <p>No channels found</p>
        </div>
      ) : (
        <>
          <p className="text-white/30 text-xs mb-4">{filtered.length} channels</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
