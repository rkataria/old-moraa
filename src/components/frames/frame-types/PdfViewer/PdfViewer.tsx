import { Edit } from './Edit'
import { Live } from './Live'
import { Preview } from './Preview'
import { Thumbnail } from './Thumbnail'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { PdfFrame } from '@/types/frame-picker.type'

type PdfViewerFrameProps = {
  frame: PdfFrame
  isLiveSession?: boolean
  asThumbnail?: boolean
}

export function PdfViewerFrame({
  frame,
  isLiveSession,
  asThumbnail,
}: PdfViewerFrameProps) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (isLiveSession) {
    return <Live frame={frame as PdfFrame} />
  }

  if (asThumbnail) {
    return <Thumbnail frame={frame as PdfFrame} />
  }

  if (!preview && permissions.canUpdateFrame) {
    return <Edit frame={frame} />
  }

  return <Preview frame={frame} />
}
