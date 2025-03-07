/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/no-danger */
import { Embed } from './Embed'

import { EmbedLinkFrame } from '@/types/frame-picker.type'

type PreviewProps = {
  frame: EmbedLinkFrame
}

export function Preview({ frame }: PreviewProps) {
  return (
    <Embed
      html={frame.content.html}
      canonical={frame.content?.raw?.meta?.canonical}
    />
  )
}
