import { Preview } from './Preview'

import { EmbedLinkFrame } from '@/types/frame-picker.type'

type LiveProps = {
  frame: EmbedLinkFrame
}

export function Live({ frame }: LiveProps) {
  return <Preview frame={frame} />
}
