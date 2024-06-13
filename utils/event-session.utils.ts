import { getFilteredFramesByStatus } from './event.util'

import { ISection, IFrame } from '@/types/frame.type'

export const getPreviousFrame = ({
  sections,
  currentFrame,
  onlyPublished = false,
}: {
  sections: ISection[]
  currentFrame: IFrame | null
  onlyPublished?: boolean
}) => {
  if (!currentFrame) {
    if (!currentFrame) {
      const frames = getFilteredFramesByStatus({
        frames: sections.flatMap((section) => section.frames ?? []),
        status: onlyPublished ? 'PUBLISHED' : null,
      })

      return frames.at(-1)
    }
  }

  const section = sections.find((s) => s.id === currentFrame.section_id)

  if (!section) return null

  const currentFrameIndex = section.frames.findIndex(
    (frame) =>
      frame.id === currentFrame.id &&
      (!onlyPublished || frame.status === 'PUBLISHED')
  )

  if (currentFrameIndex > 0) {
    return section.frames[currentFrameIndex - 1]
  }

  const sectionIndex = sections.findIndex((s) => s.id === section.id)

  if (sectionIndex > 0) {
    const previousSectionFrames = sections[sectionIndex - 1].frames

    return previousSectionFrames[previousSectionFrames.length - 1]
  }

  return null
}

export const getNextFrame = ({
  sections = [],
  currentFrame,
  onlyPublished = false,
}: {
  sections: ISection[]
  currentFrame: IFrame | null
  onlyPublished?: boolean
}) => {
  if (!currentFrame) {
    const frames = getFilteredFramesByStatus({
      frames: sections.flatMap((section) => section.frames ?? []),
      status: onlyPublished ? 'PUBLISHED' : null,
    })

    return frames?.[0]
  }

  const section = sections.find((s) => s.id === currentFrame.section_id)

  if (!section) return null

  const currentSectionFrames = section.frames

  const currentFrameIndex = currentSectionFrames.findIndex(
    (frame) =>
      frame.id === currentFrame.id &&
      (!onlyPublished || frame.status === 'PUBLISHED')
  )

  if (currentFrameIndex < currentSectionFrames.length - 1) {
    return currentSectionFrames[currentFrameIndex + 1]
  }

  const sectionIndex = sections.findIndex((s) => s.id === section.id)

  if (sectionIndex < sections.length - 1) {
    return (sections[sectionIndex + 1].frames ?? [])[0]
  }

  return null
}
