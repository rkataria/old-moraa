import { SlideItem } from './SlideItem'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

type SlideListProps = {
  slides: ISlide[]
}

export function SlideList({ slides }: SlideListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  return (
    <div
      className={cn('flex flex-col gap-2', {
        'p-2 pl-4 pr-0': sidebarExpanded,
        'py-2': !sidebarExpanded,
      })}>
      {slides.map((slide) => (
        <SlideItem key={slide.id} slide={slide} />
      ))}
    </div>
  )
}
