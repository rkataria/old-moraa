import { Preview } from './Preview'

import { FrameNoContentPlaceholder } from '@/components/common/FrameNoContentPlaceholder'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { PdfFrame } from '@/types/frame-picker.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: PdfFrame }) {
  const showPlaceholder = !frame.content?.pdfPath

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.PDF_VIEWER} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Preview frame={frame} hideControls />
      </RenderIf>
    </div>
  )
}
