import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  console.log('🚀 ~ Live ~ frame:', frame)

  return <Editor />
}
