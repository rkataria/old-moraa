import { Editor } from './Editor'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} />

      <Editor frame={frame} readOnly />
    </>
  )
}
