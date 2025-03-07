import { Preview } from './Preview'

import { type MoraaSlideFrame } from '@/types/frame-picker.type'

type LiveProps = {
  frame: MoraaSlideFrame
}

export function Live({ frame }: LiveProps) {
  return <Preview frame={frame} />
}
