import { Editor } from './Editor'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
  allowToCollaborate?: boolean
}

export function Live({ frame, allowToCollaborate }: LiveProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} key={frame.id} />

      <Editor
        editorId={frame.id}
        editable={allowToCollaborate}
        classNames={{ wrapper: 'overflow-hidden' }}
        startContent={!allowToCollaborate}
      />
    </>
  )
}
