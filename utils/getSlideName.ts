import { ISlide } from '@/types/slide.type'

export const getSlideName = (slide: ISlide) => {
  const slideName =
    slide.name.toLocaleLowerCase().startsWith('slide') && slide.content?.title
      ? slide.content.title
      : slide.name

  return slideName
}
