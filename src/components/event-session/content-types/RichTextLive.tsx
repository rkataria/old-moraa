import { RichTextEditor } from '../../common/content-types/RichText/Editor'

import { FrameTitleDescription } from '@/components/common/FrameTitleDescriptionPreview'
import { IFrame } from '@/types/frame.type'

export function RichTextLive({ frame }: { frame: IFrame }) {
  const canEditInLive = () => {
    if (frame.config.allowToCollaborate) {
      return true
    }

    return false
  }

  return (
    <RichTextEditor
      editorId={frame.id}
      editable={canEditInLive()}
      classNames={{ wrapper: 'overflow-hidden' }}
      startContent={!canEditInLive() && <FrameTitleDescription frame={frame} />}
    />
  )
}
