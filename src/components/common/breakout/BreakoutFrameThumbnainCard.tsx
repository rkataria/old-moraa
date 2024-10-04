import { useEffect, useMemo, useRef, useState } from 'react'

// eslint-disable-next-line import/no-cycle
import { ContentLoading } from '../ContentLoading'
// TODO: Fix import cycle
// eslint-disable-next-line import/no-cycle
import { FramePreview } from '../FramePreview'

import { IFrame } from '@/types/frame.type'

type BreakoutFrameThumbnailCardProps = {
  frame: IFrame
  containerWidth: number
  inViewPort?: boolean
}

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 540

export function BreakoutFrameThumbnailCard({
  frame,
  containerWidth,
  inViewPort,
}: BreakoutFrameThumbnailCardProps) {
  const [renderCard, setRenderCard] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!inViewPort) {
      setRenderCard(false)
      clearTimeout(timerRef.current as NodeJS.Timeout)

      return
    }

    timerRef.current = setTimeout(() => {
      setRenderCard(true)
    }, 1000)
  }, [inViewPort])

  const memoizedFramePreview = useMemo(
    () =>
      renderCard ? (
        <FramePreview
          frame={frame}
          isInteractive={false}
          fullWidth
          asThumbnail
        />
      ) : (
        <ContentLoading />
      ),
    [frame, renderCard]
  )

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0 hide-scrollbars"
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
