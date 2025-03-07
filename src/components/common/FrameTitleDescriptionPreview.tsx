import { ReactNode } from 'react'

import { IFrame, TextBlock } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

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

function FrameTitle({
  title,
  textColor,
  afterTitle,
}: {
  title: string
  textColor?: string
  afterTitle?: ReactNode
}) {
  if (title === '') return null

  return (
    <h1
      className="heading-2-bold w-full border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0"
      style={{ color: textColor }}>
      {title}
      {afterTitle}
    </h1>
  )
}

function TextBlockView({ block }: { block: TextBlock }) {
  if (!block) return null

  return (
    <div
      style={{ wordBreak: 'break-word' }}
      key={`block-editor-${block.id}`}
      className={cn('w-full text-base tiptap ProseMirror', {
        'block-content-header': block.type === 'header',
        'block-content-paragraph': block.type === 'paragraph',
      })}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: block.data.html,
      }}
    />
  )
}
