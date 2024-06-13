import { FramePreview } from '../FramePreview'

import { IFrame } from '@/types/frame.type'
import { isFrameThumbnailAvailable } from '@/utils/content.util'

type FrameThumbnailCardProps = {
  frame: IFrame
  containerWidth: number
}

export function FrameThumbnailCard({
  frame,
  containerWidth,
}: FrameThumbnailCardProps) {
  if (!isFrameThumbnailAvailable(frame.type)) {
    return (
      <div className="w-full h-full flex justify-center items-center font-semibold capitalize">
        {frame.type}
      </div>
    )
  }

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0"
      style={{
        width: `${window.screen.width}px`,
        height: `${(window.screen.width * 9) / 16}px`,
        transformOrigin: 'left top',
        scale: `${(1 / window.screen.width) * containerWidth}`,
      }}>
      <FramePreview
        readOnly
        frame={frame}
        key={JSON.stringify(frame.content)}
      />
    </div>
  )
}
