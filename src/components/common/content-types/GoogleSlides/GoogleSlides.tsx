/* eslint-disable jsx-a11y/iframe-has-title */
import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { GoogleSlidesType } from '@/types/frame-picker.type'

type GoogleSlidesProps = {
  frame: GoogleSlidesType
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function GoogleSlides({
  frame,
  isLiveSession,
  asThumbnail,
}: GoogleSlidesProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame} />
  }

  if (
    preview ||
    !permissions.canUpdateFrame ||
    asThumbnail ||
    frame.content?.individualFrame
  ) {
    return <Preview frame={frame} />
  }

  return <Edit frame={frame} />
}
