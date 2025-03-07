import { Editor } from './Editor'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} />
      <Editor frame={frame} />
    </>
  )
}
