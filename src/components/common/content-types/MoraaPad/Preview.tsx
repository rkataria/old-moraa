import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'
import { Editor } from '../RichText/Editor'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} key={frame.id} />
      <Editor
        hideSideBar
        editorId={frame.id}
        editable={false}
        enableCollaboration
        classNames={{
          wrapper: 'overflow-hidden',
          container: 'flex flex-col overflow-hidden',
        }}
      />
    </>
  )
}
