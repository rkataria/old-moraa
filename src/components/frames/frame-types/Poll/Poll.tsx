import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame, type PollFrame } from '@/types/frame.type'

type VideoFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function PollFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: VideoFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame as PollFrame} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame as PollFrame} />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame as PollFrame} />
  }

  return <Preview frame={frame as PollFrame} />
}
