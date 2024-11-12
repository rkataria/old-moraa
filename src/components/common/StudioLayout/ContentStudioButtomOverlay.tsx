import { Toolbars } from '../content-types/MoraaSlide/Toolbars'

import { useEventContext } from '@/contexts/EventContext'
import { FrameType } from '@/utils/frame-picker.util'

export function ContentStudioBottomOverlay() {
  const { currentFrame, isOwner, preview } = useEventContext()

  const editable = isOwner && !preview
  const showToolbars = editable && currentFrame?.type === FrameType.MORAA_SLIDE

  if (!showToolbars) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-end items-center gap-2 p-2 bg-white rounded-md shadow-lg border-1 border-gray-100">
      <Toolbars />
    </div>
  )
}
