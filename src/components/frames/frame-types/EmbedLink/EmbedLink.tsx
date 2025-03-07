/* eslint-disable jsx-a11y/iframe-has-title */
import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { type EmbedLinkFrame } from '@/types/frame-picker.type'

type EmbedLinkFrameProps = {
  frame: EmbedLinkFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function EmbedLinkFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: EmbedLinkFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame} />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame} />
  }

  return <Preview frame={frame} />
}
