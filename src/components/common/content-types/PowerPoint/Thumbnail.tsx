import { Preview } from './Preview'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

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
