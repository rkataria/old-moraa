/* eslint-disable @typescript-eslint/no-explicit-any */
import { Embed } from './Embed'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: IFrame }) {
  const showPlaceholder = !frame.content?.boardId

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.MIRO_EMBED} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Embed frame={frame as any} />
      </RenderIf>
    </div>
  )
}
