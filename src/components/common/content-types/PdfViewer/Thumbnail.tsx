import { Preview } from './Preview'

import { PdfFrame } from '@/types/frame-picker.type'

export function Thumbnail({ frame }: { frame: PdfFrame }) {
  return <Preview frame={frame} hideControls />
}
