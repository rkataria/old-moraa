import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return (
    <Editor
      editorId={frame.id}
      hideSideBar
      editable
      classNames={{ wrapper: 'overflow-hidden' }}
    />
  )
}
