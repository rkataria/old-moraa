import { Editor } from './Editor'

import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return (
    <>
      <FrameTitleDescriptionPanel key={frame.id} />
      <Editor readOnly={false} frame={frame} />
    </>
  )
}
