import { Editor } from '../RichText/Editor'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return (
    <Editor
      hideSideBar
      editorId={frame.id}
      editable
      enableCollaboration
      classNames={{
        wrapper: 'overflow-hidden',
        container: 'flex flex-col overflow-hidden',
      }}
    />
  )
}
