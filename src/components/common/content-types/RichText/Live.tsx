import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
  allowToCollaborate?: boolean
}

export function Live({ frame, allowToCollaborate }: LiveProps) {
  return (
    <Editor
      editorId={frame.id}
      editable={allowToCollaborate}
      classNames={{ wrapper: 'overflow-hidden' }}
      startContent={!allowToCollaborate}
    />
  )
}
