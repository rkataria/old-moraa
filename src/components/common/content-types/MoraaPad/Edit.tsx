import { Editor } from '../RichText/Editor'

import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
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
