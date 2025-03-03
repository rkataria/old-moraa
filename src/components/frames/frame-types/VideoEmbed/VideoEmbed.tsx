/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame } from '@/types/frame.type'

type VideoEmbedFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function VideoEmbedFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: VideoEmbedFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()
  const showControls =
    permissions.canUpdateFrame || (!isLiveSession && !asThumbnail)

  if (isLiveSession) {
    return <Live frame={frame} showControls={showControls} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame} />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame as any} />
  }

  return <Preview frame={frame} showControls={showControls} />
}
