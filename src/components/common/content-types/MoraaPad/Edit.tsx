import { Editor } from '../RichText/Editor'

import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return (
    <>
      <FrameTitleDescriptionPanel key={frame.id} />

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
    </>
  )
}
