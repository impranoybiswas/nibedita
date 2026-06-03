export type StreamType = 'hls' | 'dash'

export type ChannelGroup =
  | 'Bangla'
  | 'News'
  | 'Indian'
  | 'Music'
  | 'Kids'
  | 'Documentary'
  | 'Religious'
  | 'Sports'
  | 'Movies'
  | 'Live'
  | 'Other'

export interface Channel {
  id: string
  name: string
  slug: string
  logo: string
  group: ChannelGroup | string
  streamUrl: string
  streamType: StreamType
}
