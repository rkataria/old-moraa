import { Toolbars } from '../content-types/MoraaSlide/Toolbars'
import { ContentType } from '../ContentTypePicker'

import { useEventContext } from '@/contexts/EventContext'

export function ContentStudioBottomOverlay() {
  const { currentFrame, isOwner, preview } = useEventContext()

  const editable = isOwner && !preview
  const showToolbars =
    editable && currentFrame?.type === ContentType.MORAA_SLIDE

  if (!showToolbars) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-end items-center gap-2 p-2 bg-white rounded-md shadow-2xl">
      <Toolbars />
    </div>
  )
}
