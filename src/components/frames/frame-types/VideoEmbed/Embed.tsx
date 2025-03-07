import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'

type EmbedProps = {
  url: string
  showControls?: boolean
  playerProps?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export function Embed({ url, showControls, playerProps = {} }: EmbedProps) {
  return (
    <ResponsiveVideoPlayer
      url={url}
      showControls={showControls}
      {...playerProps}
    />
  )
}
