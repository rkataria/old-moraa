/* eslint-disable @typescript-eslint/no-explicit-any */
import { Embed } from './Embed'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return <Embed frame={frame as any} />
}
