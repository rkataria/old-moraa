import { FrameTitle } from '../event-session/content-types/common/FrameTitle'
import { TextBlockView } from '../event-session/content-types/common/TextBlockView'

import { ContentType } from '@/components/common/ContentTypePicker'
import { IFrame, TextBlock } from '@/types/frame.type'

export function FrameTitleDescription({ frame }: { frame: IFrame }) {
  const frameTitle = frame.content?.title || frame.content?.question

  return (
    <>
      <FrameTitle title={(frameTitle as string) || ''} />
      <TextBlockView
        block={
          frame.content?.blocks?.find(
            (block) => block.type === 'paragraph'
          ) as TextBlock
        }
      />
    </>
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

  if ([ContentType.COVER, ContentType.TEXT_IMAGE].includes(frame.type)) {
    return null
  }

  if (frame.type === ContentType.RICH_TEXT) {
    if (!frame.config.allowToCollaborate && !asThumbnail) return null
  }

  return <FrameTitleDescription frame={frame} />
}
