import { Preview } from './Preview'

import { FrameNoContentPlaceholder } from '@/components/common/FrameNoContentPlaceholder'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EmbedLinkFrame } from '@/types/frame-picker.type'
import { FrameType } from '@/utils/frame-picker.util'

type ThumbnailProps = {
  frame: EmbedLinkFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  const showPlaceholder =
    !frame.content?.html && !frame.content?.raw?.meta?.canonical

  return (
    <>
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.EMBED_LINK} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} />
      </RenderIf>
    </>
  )
}
