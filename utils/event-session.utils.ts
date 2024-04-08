import { ISection, ISlide } from '@/types/slide.type'

export const getPreviousSlide = ({
  sections,
  currentSlide,
}: {
  sections: ISection[]
  currentSlide: ISlide | null
}) => {
  if (!currentSlide) return sections[0].slides[0]

  const section = sections.find((s) => s.id === currentSlide.section_id)
  if (!section) return sections[0].slides[0]

  const currentSlideIndex = section.slides.findIndex(
    (slide) => slide.id === currentSlide.id
  )

  if (currentSlideIndex > 0) {
    return section.slides[currentSlideIndex - 1]
  }

  const sectionIndex = sections.findIndex((s) => s.id === section.id)

  if (sectionIndex > 0) {
    const previousSectionSlides = sections[sectionIndex - 1].slides

    return previousSectionSlides[previousSectionSlides.length - 1]
  }

  return null
}

export const getNextSlide = ({
  sections,
  currentSlide,
}: {
  sections: ISection[]
  currentSlide: ISlide | null
}) => {
  if (!currentSlide) return sections[0].slides[0]

  const section = sections.find((s) => s.id === currentSlide.section_id)
  if (!section) return sections[0].slides[0]

  const currentSectionSlides = section.slides

  const currentSlideIndex = currentSectionSlides.findIndex(
    (slide) => slide.id === currentSlide.id
  )

  if (currentSlideIndex < currentSectionSlides.length - 1) {
    return currentSectionSlides[currentSlideIndex + 1]
  }

  const sectionIndex = sections.findIndex((s) => s.id === section.id)

  if (sectionIndex < sections.length - 1) {
    return (sections[sectionIndex + 1].slides ?? [])[0]
  }

  return null
}
