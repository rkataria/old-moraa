import { Preview } from './Preview'

import { FrameNoContentPlaceholder } from '@/components/common/FrameNoContentPlaceholder'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail() {
  const showPlaceholder = true

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.POWERPOINT} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview />
      </RenderIf>
    </div>
  )
}
