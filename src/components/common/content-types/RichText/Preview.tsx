import { Editor } from './Editor'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} />

      <Editor
        editorId={frame.id}
        editable={false}
        classNames={{
          wrapper:
            'overflow-hidden border border-gray-200 bg-[#FEFEFE] rounded-md',
        }}
        hideSideBar
        enableCollaboration={false}
      />
    </>
  )
}
