/* eslint-disable @typescript-eslint/no-explicit-any */
import { Embed } from './Embed'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return <Embed frame={frame as any} />
}
