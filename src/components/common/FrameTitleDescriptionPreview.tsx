import { FrameTitle } from '../event-session/content-types/common/FrameTitle'
import { TextBlockView } from '../event-session/content-types/common/TextBlockView'

import { IFrame, TextBlock } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameTitleDescription({ frame }: { frame: IFrame }) {
  const frameTitle = frame.content?.title || frame.content?.question

  return (
    <div className="flex flex-col gap-2">
      <FrameTitle title={(frameTitle as string) || ''} />
      <TextBlockView
        block={
          frame.content?.blocks?.find(
            (block) => block.type === 'paragraph'
          ) as TextBlock
        }
      />
    </div>
  )
}

export function FrameTitleDescriptionPreview({
  frame,
  asThumbnail = false,
}: {
  frame: IFrame
  asThumbnail?: boolean
}) {
  if (!frame) return null

  if (
    [
      FrameType.GOOGLE_SLIDES,
      FrameType.PDF_VIEWER,
      FrameType.IMAGE_VIEWER,
      FrameType.MIRO_EMBED,
      FrameType.PDF_VIEWER,
      FrameType.VIDEO_EMBED,
      FrameType.VIDEO,
    ].includes(frame.type)
  ) {
    return null
  }

  if (asThumbnail && frame.type === FrameType.MORAA_SLIDE) return null

  return <FrameTitleDescription frame={frame} />
}
