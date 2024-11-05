import { Editor } from './Editor'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
  allowToCollaborate?: boolean
}

export function Preview({ frame, allowToCollaborate }: PreviewProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} />

      <Editor
        editorId={frame.id}
        editable={allowToCollaborate}
        classNames={{ wrapper: 'overflow-hidden' }}
        startContent={!allowToCollaborate}
      />
    </>
  )
}
