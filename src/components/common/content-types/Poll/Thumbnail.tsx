import { Preview } from './Preview'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { PollFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: PollFrame }) {
  const showPlaceholder = !frame.content?.question

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.POLL} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} />
      </RenderIf>
    </div>
  )
}
