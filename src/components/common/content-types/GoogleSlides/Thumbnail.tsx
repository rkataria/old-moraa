import { Preview } from './Preview'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { GoogleSlidesFrame } from '@/types/frame-picker.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: GoogleSlidesFrame }) {
  const showPlaceholder = !frame.content?.googleSlideUrl

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.GOOGLE_SLIDES} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} />
      </RenderIf>
    </div>
  )
}
