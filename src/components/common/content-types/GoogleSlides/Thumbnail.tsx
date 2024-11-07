import { Preview } from './Preview'

import { GoogleSlidesFrame } from '@/types/frame-picker.type'

export function Thumbnail({ frame }: { frame: GoogleSlidesFrame }) {
  return <Preview frame={frame} />
}
