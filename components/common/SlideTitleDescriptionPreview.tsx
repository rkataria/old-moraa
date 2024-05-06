import { SlideTitle } from '../event-session/content-types/common/SlideTitle'
import { TextBlockView } from '../event-session/content-types/common/TextBlockView'

import { ContentType } from '@/components/common/ContentTypePicker'
import { ISlide, TextBlock } from '@/types/slide.type'

export function SlideTitleDescriptionPreview({ slide }: { slide: ISlide }) {
  if (!slide) return null

  if ([ContentType.COVER, ContentType.TEXT_IMAGE].includes(slide.type)) {
    return null
  }
  const slideTitle = slide.content?.title || slide.content?.question

  const renderTitle = () => {
    if ([ContentType.POLL, ContentType.REFLECTION].includes(slide.type)) {
      return <SlideTitle title={(slideTitle as string) || ''} />
    }
    if (!slide.config.showTitle) return null

    return (
      <TextBlockView
        block={
          slide.content?.blocks?.find(
            (block) => block.type === 'header'
          ) as TextBlock
        }
      />
    )
  }

  const renderDescription = () => {
    // if ([ContentType.POLL ContentType.REFLECTION].includes(slide.type)) {
    //   return <SlideDescription description={slide.content?.description || ''} />
    // }
    if (!slide.config.showDescription) return null

    return (
      <TextBlockView
        block={
          slide.content?.blocks?.find(
            (block) => block.type === 'paragraph'
          ) as TextBlock
        }
      />
    )
  }

  return (
    <>
      {renderTitle()}
      {renderDescription()}
    </>
  )
}
