import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type ThumbnailProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  return <Editor frame={frame} asThumbnail />
}
