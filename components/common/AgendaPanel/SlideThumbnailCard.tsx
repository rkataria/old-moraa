import { SlidePreview } from '../SlidePreview'

import { ISlide } from '@/types/slide.type'
import { isSlideThumbnailAvailable } from '@/utils/content.util'

type SlideThumbnailCardProps = {
  slide: ISlide
  containerWidth: number
}

export function SlideThumbnailCard({
  slide,
  containerWidth,
}: SlideThumbnailCardProps) {
  if (!isSlideThumbnailAvailable(slide.type)) {
    return (
      <div className="w-full h-full flex justify-center items-center font-semibold capitalize">
        {slide.type}
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
      <SlidePreview
        readOnly
        slide={slide}
        key={JSON.stringify(slide.content)}
      />
    </div>
  )
}
