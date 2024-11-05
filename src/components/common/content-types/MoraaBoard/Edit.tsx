import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return <Editor frame={frame} readOnly={false} />
}
