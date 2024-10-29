import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'

type MoraaBoardFrameProps = {
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function MoraaBoardFrame({
  isLiveSession,
  asThumbnail,
}: MoraaBoardFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live />
  }

  if (asThumbnail) {
    return <Thumbnail />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit />
  }

  return <Preview />
}
