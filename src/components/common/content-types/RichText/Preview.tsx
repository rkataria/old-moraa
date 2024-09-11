import { ReactNode } from '@tanstack/react-router'

import { RichTextEditor } from './Editor'

import { IFrame } from '@/types/frame.type'

export function RichTextPreview({
  frame,
  asThumbnail,
  startContent,
}: {
  frame: IFrame
  asThumbnail?: boolean
  startContent?: ReactNode
}) {
  const canEditRichText = !!(!asThumbnail && frame.config.allowToCollaborate)

  const visibleStartContent = !asThumbnail && !canEditRichText

  return (
    <RichTextEditor
      editorId={frame.id}
      editable={canEditRichText}
      startContent={visibleStartContent ? startContent : null}
      hideSideBar={asThumbnail}
    />
  )
}
