/* eslint-disable jsx-a11y/iframe-has-title */
import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

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
    return <Live frame={frame} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame} />
  }

  if (
    !preview &&
    permissions.canUpdateFrame &&
    !frame.content?.individualFrame
  ) {
    return <Edit frame={frame} />
  }

  return <Preview frame={frame} />
}
