import { useMemo } from 'react'

// eslint-disable-next-line import/no-cycle
import { Frame } from '../../frames/Frame/Frame'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type FrameThumbnailCardProps = {
  frame: IFrame
  containerWidth: number
}

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 540

export function FrameThumbnailCard({
  frame,
  containerWidth,
}: FrameThumbnailCardProps) {
  const memoizedFramePreview = useMemo(
    () => <Frame frame={frame} isThumbnail />,
    [frame]
  )

  return (
    <div
      className={cn(
        'absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0',
        {
          'hide-scrollbars': ![FrameType.MORAA_BOARD].includes(frame.type),
        }
      )}
      style={{
        width: `${DEFAULT_WIDTH}px`,
        height: `${DEFAULT_HEIGHT}px`,
        transformOrigin: 'left top',
        scale: `${(1 / DEFAULT_WIDTH) * containerWidth}`,
      }}>
      {memoizedFramePreview}
    </div>
  )
}
