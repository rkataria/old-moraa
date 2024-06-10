import { ISlide } from '@/types/slide.type'

export type SlideStatusType = 'PUBLISHED' | 'DRAFT' | null

export const getFilteredSlidesByStatus = ({
  slides,
  status,
}: {
  slides: ISlide[]
  status: SlideStatusType
}) =>
  slides.filter((slide) => {
    if (!status) return true

    return slide.status === status
  })
