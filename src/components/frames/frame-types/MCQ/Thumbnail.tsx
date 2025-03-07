import { Preview } from './Preview'

import { FrameNoContentPlaceholder } from '@/components/common/FrameNoContentPlaceholder'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { MCQFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: MCQFrame }) {
  const showPlaceholder =
    !frame.content?.title ||
    !!frame.content?.options.some((option) => !option.name)

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.MCQ} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} />
      </RenderIf>
    </div>
  )
}
