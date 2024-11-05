import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return <Editor frame={frame} />
}
