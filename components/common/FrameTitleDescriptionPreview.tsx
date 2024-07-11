import { FrameTitle } from '../event-session/content-types/common/FrameTitle'
import { TextBlockView } from '../event-session/content-types/common/TextBlockView'

import { ContentType } from '@/components/common/ContentTypePicker'
import { IFrame, TextBlock } from '@/types/frame.type'

export function FrameTitleDescriptionPreview({ frame }: { frame: IFrame }) {
  if (!frame) return null

  if ([ContentType.COVER, ContentType.TEXT_IMAGE].includes(frame.type)) {
    return null
  }
  const frameTitle = frame.content?.title || frame.content?.question

  const renderTitle = () => {
    if ([ContentType.POLL, ContentType.REFLECTION].includes(frame.type)) {
      return <FrameTitle title={(frameTitle as string) || ''} />
    }

    return (
      <TextBlockView
        block={
          frame.content?.blocks?.find(
            (block) => block.type === 'header'
          ) as TextBlock
        }
      />
    )
  }

  const renderDescription = () => (
    <TextBlockView
      block={
        frame.content?.blocks?.find(
          (block) => block.type === 'paragraph'
        ) as TextBlock
      }
    />
  )

  return (
    <>
      {renderTitle()}
      {renderDescription()}
    </>
  )
}
