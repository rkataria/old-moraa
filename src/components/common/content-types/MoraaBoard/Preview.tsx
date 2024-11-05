import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return <Editor frame={frame} readOnly />
}
