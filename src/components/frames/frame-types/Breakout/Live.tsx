// eslint-disable-next-line import/no-cycle
import {
  BreakoutFrame,
  BreakoutFrameLive,
} from '@/components/frames/frame-types/Breakout/BreakoutFrameLive'
import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  return <BreakoutFrameLive frame={frame as BreakoutFrame} />
}
