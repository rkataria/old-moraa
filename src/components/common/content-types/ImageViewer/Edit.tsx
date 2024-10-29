import { Preview } from './Preview'

import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return <Preview frame={frame} />
}
