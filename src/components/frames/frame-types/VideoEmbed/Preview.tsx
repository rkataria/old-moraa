import { Embed } from './Embed'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
  showControls?: boolean
}

export function Preview({ frame, showControls }: PreviewProps) {
  const videoUrl = frame.content?.videoUrl as string

  if (!videoUrl) return null

  return <Embed url={videoUrl} showControls={showControls} />
}
