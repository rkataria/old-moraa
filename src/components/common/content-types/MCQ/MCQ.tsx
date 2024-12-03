import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame, MCQFrame as MCQFrameType } from '@/types/frame.type'

type MCQFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function MCQFrame({ frame, isLiveSession, asThumbnail }: MCQFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame as MCQFrameType} />
  }

  if (!preview && permissions.canUpdateFrame && !asThumbnail) {
    return <Edit frame={frame as MCQFrameType} />
  }

  return <Preview frame={frame as MCQFrameType} />
}
