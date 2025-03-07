import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame } from '@/types/frame.type'

type RichTextFrameProps = {
  frame: IFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function RichTextFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: RichTextFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame} key={frame.id} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame} />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame} key={frame.id} />
  }

  return <Preview frame={frame} key={frame.id} />
}
