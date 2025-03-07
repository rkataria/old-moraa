import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame } from '@/types/frame.type'

type PowerPointFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function PowerPointFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: PowerPointFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live />
  }

  if (asThumbnail) {
    return <Thumbnail />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame} />
  }

  return <Preview />
}
