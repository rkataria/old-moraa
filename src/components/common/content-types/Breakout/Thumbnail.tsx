// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../../breakout/BreakoutFrame'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type PreviewProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: PreviewProps) {
  const breakoutActivityQuery = useBreakoutActivities({
    frameId: frame.id!,
  })
  const showPlaceholder = !!breakoutActivityQuery.data?.some(
    (br) => !br.activity_frame_id
  )

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
