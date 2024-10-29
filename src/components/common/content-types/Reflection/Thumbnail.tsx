import { Preview } from './Preview'

import { IFrame } from '@/types/frame.type'

export function Thumbnail({ frame }: { frame: IFrame }) {
  return <Preview frame={frame} />
}
