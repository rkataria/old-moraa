/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
import { useEffect, useRef, useState } from 'react'

import { DragDropContext, Draggable } from 'react-beautiful-dnd'

import { SectionItem } from './SectionItem'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { useEventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { reorderFrameAction } from '@/stores/slices/event/current-event/section.slice'
import { buildReorderFramesPayload } from '@/utils/drag.utils'
import { cn, scrollParentToChild } from '@/utils/utils'

export function SectionList() {
  const { sections, reorderSection, reorderFrame, eventMode, preview } =
    useEventContext()
  const { permissions } = useEventPermissions()
  const sectionListRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()
  const currentFrame = useCurrentFrame()

  const dispatch = useStoreDispatch()

  const { setDraggingFrameId, selectedFrameIds, expandedSectionIds } =
    useAgendaPanel()

  const expanded = leftSidebarVisiblity === 'maximized'

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToActiveFrame = () => {
    if (!currentFrame) return

    const currentFrameElement = document.querySelector(
      `div[data-miniframe-id="${currentFrame.id}"]`
    )

    const ele = currentFrameElement

    if (!ele) return

    scrollParentToChild({
      parent: sectionListRef.current!,
      child: ele as HTMLElement,
      topOffset: 100,
      bottomOffset: 100,
    })
  }

  useEffect(() => {
    scrollToActiveFrame()
  }, [currentFrame, scrollToActiveFrame])

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

  const handleSingleFrameDragEnd = (result: any, provided: any) => {
    reorderFrame(result, provided)

    updateSectionList([...sections])

    return null
  }

  const handleMultiFrameDragEnd = (result: any) => {
    dispatch(
      reorderFrameAction(
        buildReorderFramesPayload(
          sections,
          result,
          expandedSectionIds,
          selectedFrameIds
        )
      )
    )

    updateSectionList([...sections])
  }

  const handleOnDragFrame = (result: any, provided: any) => {
    const isMultiDrag = selectedFrameIds.length > 1
    if (isMultiDrag) {
      handleMultiFrameDragEnd(result)

      return
    }
    handleSingleFrameDragEnd(result, provided)
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
      {/* <button onClick={() => setDragAllowed(true)}>Enable</button> */}
      <DragDropContext
        onDragStart={(result) => {
          setDraggingFrameId(
            result.draggableId.split('frame-draggable-frameId-')[1]
          )
        }}
        onDragEnd={(result, provided) => {
          setDraggingFrameId('')
          if (!permissions.canUpdateSection) return
          if (!result.destination) return
          if (result.type === 'section') {
            handleOnDragEndSections(result, provided)
          }
          if (result.type === 'frame') handleOnDragFrame(result, provided)
        }}>
        <StrictModeDroppable droppableId="section-droppable" type="section">
          {(sectionDroppableProvided) => (
            <div
              className={cn(
                'flex flex-col justify-start items-center gap-2 w-full flex-nowrap overflow-auto !scroll-auto pb-[10rem] scrollbar-none'
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
