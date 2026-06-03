import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🇧🇩</span>
          <span className="text-white font-bold text-lg tracking-tight">
            BD<span className="text-red-500">TV</span>
          </span>
          <span className="text-white/30 text-xs ml-1">Live</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            All Channels
          </Link>
        </nav>
      </div>
    </header>
  )
}
