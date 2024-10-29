// eslint-disable-next-line import/no-cycle
import { LiveFrame } from './LiveFrame'
import { PreviewFrame } from './PreviewFrame'
import { StudioFrame } from './StudioFrame'
import { ThumbnailFrame } from './ThumbnailFrame'

import { useEventContext } from '@/contexts/EventContext'
import { IFrame } from '@/types/frame.type'

type FrameProps = {
  frame: IFrame
  isThumbnail?: boolean
}

export function Frame({ frame, isThumbnail }: FrameProps) {
  const { preview, eventMode } = useEventContext()

  if (!frame) return <div>Frame not found</div>

  if (isThumbnail) {
    return <ThumbnailFrame frame={frame} />
  }

  if (eventMode === 'edit' && !preview) {
    return <StudioFrame frame={frame} />
  }

  if (eventMode === 'present') {
    return <LiveFrame frame={frame} />
  }

  return <PreviewFrame frame={frame} />
}
