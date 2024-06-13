import { HtmlToTextOptions, convert } from 'html-to-text'

import { ContentType } from '@/components/common/ContentTypePicker'
import { IFrame, TextBlock } from '@/types/frame.type'

// export const getFrameName = (frame: IFrame) => {
//   const frameName =
//     frame.name.toLocaleLowerCase().startsWith('frame') && frame.content?.title
//       ? frame.content.title
//       : frame.name

//   return frameName
// }

const options: HtmlToTextOptions = {
  selectors: [{ selector: 'h1', options: { uppercase: false } }],
}

export const getFrameName = ({ frame }: { frame: IFrame }) => {
  if (
    !frame.content?.blocks &&
    !frame.content?.title &&
    !frame.content?.question
  ) {
    return frame.name
  }

  if (frame.type === ContentType.REFLECTION) {
    return frame.content?.title || frame.name
  }

  if (frame.type === ContentType.POLL) {
    return (frame.content?.question as string) || (frame.name as string)
  }

  const header = frame.content?.blocks?.find(
    (b) => b.type === 'header'
  ) as TextBlock

  if (!header?.data) {
    return frame.name as string
  }

  if (convert(header.data.html).length > 0) {
    return convert(header.data.html, options) as string
  }

  return frame.name as string
}
