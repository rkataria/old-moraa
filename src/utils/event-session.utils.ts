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
  const frames = getFilteredFramesByStatus({
    frames: sections.flatMap((section) => section.frames ?? []),
    status: onlyPublished ? 'PUBLISHED' : null,
  })

  if (!currentFrame) {
    return frames?.[0] ?? null
  }

  const currentFrameIndex = frames.findIndex(
    (frame) => frame.id === currentFrame.id
  )

  if (currentFrameIndex > 0 && currentFrameIndex < frames.length) {
    return frames[currentFrameIndex - 1]
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
  const frames = getFilteredFramesByStatus({
    frames: sections.flatMap((section) => section.frames ?? []),
    status: onlyPublished ? 'PUBLISHED' : null,
  })

  if (!currentFrame) {
    return frames?.[0] ?? null
  }

  const currentFrameIndex = frames.findIndex(
    (frame) => frame.id === currentFrame.id
  )

  if (currentFrameIndex < frames.length - 1) {
    return frames[currentFrameIndex + 1]
  }

  return null
}
