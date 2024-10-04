/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
import { useContext, useEffect, useRef, useState } from 'react'

import { DragDropContext, Draggable } from 'react-beautiful-dnd'

import { SectionItem } from './SectionItem'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn, scrollParentToChild } from '@/utils/utils'

export function SectionList() {
  const {
    currentFrame,
    sections,
    reorderSection,
    reorderFrame,
    eventMode,
    preview,
  } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()
  const sectionListRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()

  const expanded = leftSidebarVisiblity === 'maximized'

  useEffect(() => {
    if (!currentFrame) return

    const currentFrameElement = document.querySelector(
      `div[data-miniframe-id="${currentFrame.id}"]`
    )

    if (!currentFrameElement) return

    scrollParentToChild({
      parent: sectionListRef.current!,
      child: currentFrameElement as HTMLElement,
      topOffset: 100,
      bottomOffset: 100,
    })
  }, [currentFrame])

  const actionDisabled =
    eventMode !== 'edit' || !permissions.canUpdateSection || preview

  const [sectionList, updateSectionList] = useState(sections)

  const handleOnDragEndSections = (result: any, provided: any) => {
    reorderSection(result, provided)

    const items = Array.from(sectionList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    updateSectionList(items)
  }
  const handleOnDragEndFrame = (result: any, provided: any) => {
    reorderFrame(result, provided)

    updateSectionList([...sections])

    return null
  }

  const calculateStartingIndex = (sectionIndex: number) => {
    if (sectionIndex === 0) {
      return 1
    }

    const framesBefore = sectionList
      .slice(0, sectionIndex)
      .flatMap((section) => section.frames)
      .filter((f) => !f?.content?.breakoutFrameId).length

    return framesBefore + 1
  }

  const startingSectionIndex = calculateStartingIndex

  useEffect(() => {
    updateSectionList([...sections])
  }, [sections])

  return (
    <div
      ref={sectionListRef}
      className={cn(
        'flex flex-col gap-3 overflow-y-auto scrollbar-none scroll-smooth h-full w-full py-2',
        {
          'gap-2 py-2': !expanded,
        }
      )}>
      <DragDropContext
        onDragEnd={(result, provided) => {
          if (!permissions.canUpdateSection) return
          if (!result.destination) return
          if (result.type === 'section') {
            handleOnDragEndSections(result, provided)
          }
          if (result.type === 'frame') handleOnDragEndFrame(result, provided)
        }}>
        <StrictModeDroppable droppableId="section-droppable" type="section">
          {(sectionDroppableProvided) => (
            <div
              className={cn(
                'flex flex-col justify-start items-center gap-2 w-full flex-nowrap'
              )}
              ref={sectionDroppableProvided.innerRef}
              {...sectionDroppableProvided.droppableProps}>
              {sectionList.map((section, sectionIndex) => (
                <Draggable
                  key={`section-draggable-${section.id}`}
                  index={sectionIndex}
                  draggableId={`section-draggable-sectionId-${section.id}`}
                  isDragDisabled={actionDisabled}>
                  {(sectionDraggableProvided) => (
                    <div
                      className="w-full"
                      ref={sectionDraggableProvided.innerRef}
                      {...sectionDraggableProvided.draggableProps}
                      {...sectionDraggableProvided.dragHandleProps}>
                      <SectionItem
                        key={section.id}
                        section={section}
                        actionDisabled={actionDisabled}
                        startingIndex={startingSectionIndex(sectionIndex)}
                        sectionCount={sectionList.length}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {sectionDroppableProvided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  )
}
