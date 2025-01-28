import { ReactNode } from 'react'

import { FrameTitle } from '../event-session/content-types/common/FrameTitle'
import { TextBlockView } from '../event-session/content-types/common/TextBlockView'

import { IFrame, TextBlock } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameTitleDescription({
  frame,
  afterTitle,
}: {
  frame: IFrame
  afterTitle?: ReactNode
}) {
  const frameTitle = frame.content?.title || frame.content?.question
  const paragraph = frame.content?.blocks?.find(
    (block) => block.type === 'paragraph'
  ) as TextBlock

  if (!frameTitle && !paragraph?.data?.html) return null

  return (
    <div className="flex flex-col gap-2">
      <FrameTitle
        title={(frameTitle as string) || ''}
        afterTitle={afterTitle}
      />

      <TextBlockView block={paragraph} />
    </div>
  )
}

export function FrameTitleDescriptionPreview({
  frame,
  asThumbnail = false,
  afterTitle,
}: {
  frame: IFrame
  asThumbnail?: boolean
  afterTitle?: ReactNode
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
    ].includes(frame.type)
  ) {
    return null
  }

  if (asThumbnail && frame.type === FrameType.MORAA_SLIDE) return null

  return <FrameTitleDescription frame={frame} afterTitle={afterTitle} />
}
