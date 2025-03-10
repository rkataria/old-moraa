import { useEffect, useMemo, useRef, useState } from 'react'

// eslint-disable-next-line import/no-cycle
import { ContentLoading } from '../../../common/ContentLoading'
import { Frame } from '../../Frame/Frame'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

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
      renderCard ? <Frame frame={frame} isThumbnail /> : <ContentLoading />,
    [frame, renderCard]
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
