import { HtmlToTextOptions, convert } from 'html-to-text'

import { ContentType } from '@/components/common/ContentTypePicker'
import { ISlide, TextBlock } from '@/types/slide.type'

// export const getSlideName = (slide: ISlide) => {
//   const slideName =
//     slide.name.toLocaleLowerCase().startsWith('slide') && slide.content?.title
//       ? slide.content.title
//       : slide.name

//   return slideName
// }

const options: HtmlToTextOptions = {
  selectors: [{ selector: 'h1', options: { uppercase: false } }],
}

export const getSlideName = ({ slide }: { slide: ISlide }) => {
  if (
    !slide.content?.blocks &&
    !slide.content?.title &&
    !slide.content?.question
  ) {
    return slide.name
  }

  if (slide.type === ContentType.REFLECTION) {
    return slide.content?.title || slide.name
  }

  if (slide.type === ContentType.POLL) {
    return (slide.content?.question as string) || (slide.name as string)
  }

  const header = slide.content?.blocks?.find(
    (b) => b.type === 'header'
  ) as TextBlock

  if (!header?.data) {
    return slide.name as string
  }

  if (convert(header.data.html).length > 0) {
    return convert(header.data.html, options) as string
  }

  return slide.name as string
}
