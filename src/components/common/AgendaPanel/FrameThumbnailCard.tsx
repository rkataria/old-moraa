import { useMemo } from 'react'

// eslint-disable-next-line import/no-cycle
import { FramePreview } from '../FramePreview'

import { IFrame } from '@/types/frame.type'

type FrameThumbnailCardProps = {
  frame: IFrame
  containerWidth: number
  inViewPort?: boolean
}

export function FrameThumbnailCard({
  frame,
  containerWidth,
  inViewPort,
}: FrameThumbnailCardProps) {
  const width = 960
  const height = 540

  const memoizedFramePreview = useMemo(
    () =>
      inViewPort ? (
        <FramePreview
          frame={frame}
          isInteractive={false}
          fullWidth
          asThumbnail
        />
      ) : (
        'loading'
      ),
    [frame, inViewPort]
  )

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0 hide-scrollbars"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transformOrigin: 'left top',
        scale: `${(1 / width) * containerWidth}`,
      }}>
      {memoizedFramePreview}
    </div>
  )
}
