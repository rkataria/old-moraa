import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame } from '@/types/frame.type'

type QAFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function QAFrame({ frame, isLiveSession, asThumbnail }: QAFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame} />
  }

  if (!preview && permissions.canUpdateFrame && !asThumbnail) {
    return <Edit frame={frame} />
  }

  return <Preview frame={frame} />
}
