/* eslint-disable jsx-a11y/iframe-has-title */
import { Edit } from './Edit'
import { Preview } from './Preview'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { type GoogleSlidesFrame } from '@/types/frame-picker.type'

type GoogleSlidesFrameProps = {
  frame: GoogleSlidesFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function GoogleSlidesFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: GoogleSlidesFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Preview frame={frame} />
  }

  if (
    !preview &&
    permissions.canUpdateFrame &&
    !asThumbnail &&
    !frame.content?.individualFrame
  ) {
    return <Edit frame={frame} />
  }

  return <Preview frame={frame} />
}
