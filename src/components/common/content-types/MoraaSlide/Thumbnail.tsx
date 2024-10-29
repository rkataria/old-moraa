import { Preview } from './Preview'

import { type MoraaSlideFrame } from '@/types/frame-picker.type'

type ThumbnailProps = {
  frame: MoraaSlideFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  return <Preview frame={frame} />
}
