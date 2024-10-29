// eslint-disable-next-line import/no-cycle
import { BreakoutFrameLive } from '../../breakout/BreakoutFrameLive'

import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BreakoutFrameLive frame={frame as any} />
}
