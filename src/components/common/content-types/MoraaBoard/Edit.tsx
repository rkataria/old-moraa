import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  console.log('🚀 ~ Edit ~ frame:', frame)

  return <Editor readOnly={false} />
}
