import Link from 'next/link'
import Image from 'next/image'
import { Channel } from '@/types/channel'

const groupColors: Record<string, string> = {
  Bangla: 'bg-green-500/20 text-green-400',
  News: 'bg-blue-500/20 text-blue-400',
  Indian: 'bg-orange-500/20 text-orange-400',
  Music: 'bg-purple-500/20 text-purple-400',
  Kids: 'bg-yellow-500/20 text-yellow-400',
  Documentary: 'bg-teal-500/20 text-teal-400',
  Religious: 'bg-emerald-500/20 text-emerald-400',
  Sports: 'bg-red-500/20 text-red-400',
  Movies: 'bg-pink-500/20 text-pink-400',
  Live: 'bg-cyan-500/20 text-cyan-400',
}

export default function ChannelCard({ channel }: { channel: Channel }) {
  const badgeClass = groupColors[channel.group] ?? 'bg-gray-500/20 text-gray-400'

  return (
    <Link href={`/watch/${channel.slug}`}>
      <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10">
        {/* Live badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-400 font-medium uppercase tracking-wide">Live</span>
        </div>

        {/* Logo */}
        <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center mb-3 overflow-hidden mx-auto">
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span className="text-2xl">📺</span>
          )}
        </div>

        {/* Name */}
        <p className="text-white text-sm font-semibold text-center truncate mb-2">{channel.name}</p>

        {/* Group badge */}
        <div className="flex justify-center">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
            {channel.group}
          </span>
        </div>
      </div>
    </Link>
  )
}
