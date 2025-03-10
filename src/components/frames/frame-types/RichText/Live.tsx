import { Editor } from './Editor'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} key={frame.id} />

      <Editor
        editorId={frame.id}
        editable={false}
        classNames={{
          wrapper: 'overflow-hidden border bg-[#FEFEFE] rounded-md p-4',
        }}
        hideSideBar
        enableCollaboration={false}
      />
    </>
  )
}
