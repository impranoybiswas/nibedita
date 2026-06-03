import { channels } from "@/data/channels";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCard from "@/components/ChannelCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const channel = channels.find((c) => c.slug === slug);
  return {
    title: channel ? `${channel.name} Live — BDTV` : "Channel Not Found",
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug } = await params;
  const channel = channels.find((c) => c.slug === slug);

  if (!channel) notFound();

  // Related channels: same group, different channel
  const related = channels
    .filter((c) => c.group === channel.group && c.id !== channel.id)
    .slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
      >
        ← Back to all channels
      </Link>

      {/* Player Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer
            streamUrl={channel.streamUrl}
            streamType={channel.streamType}
            channelName={channel.name}
          />
          {/* Channel Info */}
          <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-2xl">📺</span>
              )}
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">{channel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-medium uppercase tracking-wide">
                  Live
                </span>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-white/40 text-xs">{channel.group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Channels */}
        <div>
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
            More in {channel.group}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {related.map((ch) => (
              <ChannelCard key={ch.id} channel={ch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
