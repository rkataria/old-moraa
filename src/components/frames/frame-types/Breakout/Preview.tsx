// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '@/components/frames/frame-types/Breakout/BreakoutFrame'
import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return <BreakoutFrame frame={frame as BreakoutFrame} isEditable={false} />
}
