/* eslint-disable @typescript-eslint/no-explicit-any */

import { ISection } from '@/types/frame.type'

export const buildReorderFramesPayload = (
  sections: ISection[],
  result: any,
  expandedSectionIds: string[],
  bulkSelectedFrames: string[]
) => {
  const { destination } = result

  // Extract the destination section ID
  const destinationSectionId = destination.droppableId.replace(
    'frame-droppable-sectionId-',
    ''
  )

  // Find the destination section
  const destinationSection = sections.find(
    (section) => section.id === destinationSectionId
  )

  // Retrieve nested breakout activities related to the selected frames
  const nestedBreakoutActivities =
    getNestedBreakoutActivities(bulkSelectedFrames, sections) || []

  // Check if the destination section is collapsed
  const isSectionCollapsed = !expandedSectionIds.includes(destinationSectionId)

  // Find the section where the drag started
  const sourceSection = getSectionByFrameId(
    sections,
    result.draggableId.replace('frame-draggable-frameId-', '')
  )

  // Get the indexes of all bulk-selected frames in the source section
  const bulkFrameIndexes = getFrameIndexesInSection(
    sourceSection,
    bulkSelectedFrames
  )

  // Check if the drag-and-drop is staying within the same section
  const isSameSection = destinationSectionId === sourceSection?.id

  // Calculate the final index for placing the frames in the destination section
  const destinationIndex = isSameSection
    ? // if destination index is more than bulk selected frames index
      result.destination.index > Math.max(...bulkFrameIndexes)
      ? result.destination.index - bulkSelectedFrames.length + 1
      : result.destination.index
    : result.destination.index

  // If the destination section is collapsed, append the frames at the end
  const adjustedDestinationIndex = isSectionCollapsed
    ? destinationSection?.frames?.length ?? 0
    : destinationIndex

  return {
    frameIds: [...bulkSelectedFrames, ...nestedBreakoutActivities],
    destinationSectionId,
    destinationIndex: adjustedDestinationIndex,
    nestedActivities: getAllNestedBreakoutActivities(sections),
  }
}

export function getSectionByFrameId(sections: ISection[], frameId: string) {
  if (!Array.isArray(sections)) {
    throw new Error('Invalid sections array')
  }

  return (
    sections.find(
      (section) =>
        Array.isArray(section.frames) &&
        section.frames.some((frame) => frame.id === frameId)
    ) || null
  )
}

function getFrameIndexesInSection(
  section: ISection | null,
  frameIds: string[]
) {
  if (!section || !Array.isArray(section.frames) || !Array.isArray(frameIds)) {
    throw new Error('Invalid input')
  }
  const indexes = section.frames.reduce((acc: any, frame, index) => {
    if (frameIds.includes(frame.id)) {
      acc.push(index)
    }

    return acc
  }, [])

  return indexes
}

function getNestedBreakoutActivities(
  bulkFrameIds: string[],
  sections: ISection[]
) {
  return sections
    .flatMap((section) =>
      section.frames.filter((frame: any) =>
        bulkFrameIds.includes(frame?.content?.breakoutFrameId)
      )
    )
    .map((frame) => frame.id)
}

export const getAllNestedBreakoutActivities = (sections: ISection[]) => {
  let activities: string[] = []
  // eslint-disable-next-line array-callback-return
  sections.map((section) => {
    const activitiesInsideSectionsFrames = section.frames
      .filter((f) => !!f.content?.breakoutFrameId)
      .map((f) => f.id)
    activities = [...activities, ...activitiesInsideSectionsFrames]
  })

  return activities
}
