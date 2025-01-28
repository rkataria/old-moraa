// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../../breakout/BreakoutFrame'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type PreviewProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: PreviewProps) {
  const showPlaceholder =
    !frame.content?.activityId && !frame.content?.groupActivityId

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.BREAKOUT} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <BreakoutFrame frame={frame as BreakoutFrame} isEditable={false} />
      </RenderIf>
    </div>
  )
}
