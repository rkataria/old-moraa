import { Preview } from './Preview'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { type MoraaSlideFrame } from '@/types/frame-picker.type'
import { FrameType } from '@/utils/frame-picker.util'

type ThumbnailProps = {
  frame: MoraaSlideFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  const showPlaceholder = !frame.content?.svg

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.MORAA_SLIDE} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} />
      </RenderIf>
    </div>
  )
}
