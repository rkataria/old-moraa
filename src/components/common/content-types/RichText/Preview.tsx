import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
  allowToCollaborate?: boolean
}

export function Preview({ frame, allowToCollaborate }: PreviewProps) {
  return (
    <Editor
      editorId={frame.id}
      editable={allowToCollaborate}
      classNames={{ wrapper: 'overflow-hidden' }}
      startContent={!allowToCollaborate}
    />
  )
}
