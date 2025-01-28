import { Embed } from './Embed'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type ThumbnailProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  const showPlaceholder = !frame.content?.videoUrl

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.VIDEO_EMBED} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Embed
          url={frame.content?.videoUrl}
          showControls={false}
          playerProps={{ showViewMode: false }}
        />
      </RenderIf>
    </div>
  )
}
