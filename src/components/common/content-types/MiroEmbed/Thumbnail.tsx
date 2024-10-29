/* eslint-disable @typescript-eslint/no-explicit-any */
import { Embed } from './Embed'

import { IFrame } from '@/types/frame.type'

type ThumbnailProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  return <Embed frame={frame as any} />
}
