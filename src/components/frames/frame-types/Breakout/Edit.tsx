/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-cycle

import { BreakoutFrame } from '@/components/frames/frame-types/Breakout/BreakoutFrame'
import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return <BreakoutFrame frame={frame as any} isEditable />
}
