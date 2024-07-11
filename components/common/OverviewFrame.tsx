/* eslint-disable react/no-danger */
import { useContext, useState, Fragment } from 'react'

import { Duration } from 'luxon'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { IoChevronForward } from 'react-icons/io5'
import { MdDragIndicator } from 'react-icons/md'

import { Button, Switch } from '@nextui-org/react'

import { AddItemBar } from './AgendaPanel/AddItemBar'
import { StrictModeDroppable } from './StrictModeDroppable'
import { FramesList } from '../event-content/overview-frame/FramesList'

import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function OverviewFrame() {
  const {
    isOwner,
    sections,
    showSectionPlaceholder,
    preview,
    eventMode,
    updateFrames,
    reorderSection,
    reorderFrame,
    addSection,
  } = useContext(EventContext) as EventContextType

  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const changeSectionStatus = (
    section: ISection,
    newState: FrameStatus.DRAFT | FrameStatus.PUBLISHED
  ) => {
    updateFrames({
      frameIds: section.frames.map((frame) => frame.id),
      framePayload: {
        status: newState,
      },
    })
  }

  const handleExpandSection = (id: string) => {
    let updatedExpandedSections = [...expandedSections]
    if (expandedSections.includes(id)) {
      updatedExpandedSections = updatedExpandedSections.filter((i) => i !== id)
    } else {
      updatedExpandedSections.push(id)
    }

    setExpandedSections(updatedExpandedSections)
  }

  function calculateTotalTime(frames: IFrame[]) {
    let totalTime = 0

    frames.forEach((frame) => {
      if (frame?.config && typeof frame?.config?.time === 'number') {
        totalTime += frame.config.time
      }
    })

    return totalTime
  }

  const getSectionTime = (frames: IFrame[]) => {
    const duration = Duration.fromObject({
      minutes: calculateTotalTime(frames),
    })
    const hours = Math.floor(duration.as('hours'))
    const remainingMinutes = duration.minus({ hours }).as('minutes')

    return `${hours}h ${remainingMinutes}m`
  }

  const editable = isOwner && !preview && eventMode === 'edit'

  return (
    <div className="flex flex-col flex-1 max-w-5xl m-auto p-4 pt-14">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-xl tracking-tight">Agenda Outline</p>
      </div>
      <div className="scrollbar-none">
        <DragDropContext
          onDragEnd={(result, provide) => {
            if (!editable) return
            if (!result.destination) return
            if (result.type === 'section') reorderSection(result, provide)
            if (result.type === 'frame') reorderFrame(result, provide)
          }}>
          <StrictModeDroppable droppableId="section-droppable" type="section">
            {(sectionDroppableProvided) => (
              <div
                className={cn(
                  'flex flex-col justify-start items-center gap-1 w-full flex-nowrap '
                )}
                ref={sectionDroppableProvided.innerRef}
                {...sectionDroppableProvided.droppableProps}>
                {sections.map((section, sectionIndex) => (
                  <Draggable
                    key={`section-draggable-${section.id}`}
                    draggableId={`section-draggable-sectionId-${section.id}`}
                    isDragDisabled={!editable}
                    index={sectionIndex}>
                    {(sectionDraggableProvided) => (
                      <div
                        className={cn('w-full bg-gray-100 rounded-lg border ', {
                          'border-l-8 border-r-8 border-b-8 shadow-sm':
                            expandedSections.includes(section.id),
                        })}
                        ref={sectionDraggableProvided.innerRef}
                        {...sectionDraggableProvided.draggableProps}>
                        <Fragment key={section.id}>
                          <div>
                            <div className="flex w-full items-center bg-white gap-2 py-3 px-2 border-b  rounded-lg group/section">
                              <div
                                className={cn(
                                  'flex flex-col items-center justify-center -ml-[3.0635rem] mr-0 w-[2.5rem] opacity-0 group-hover/section:opacity-100',
                                  {
                                    '-ml-[2.625rem]':
                                      !expandedSections.includes(section.id),
                                  }
                                )}>
                                <div
                                  {...sectionDraggableProvided.dragHandleProps}>
                                  <MdDragIndicator
                                    height={60}
                                    width={45}
                                    className="text-gray-400"
                                  />
                                </div>

                                <AddItemBar
                                  sectionId={section.id}
                                  frameId={section.frames?.[0]?.id}
                                  trigger={
                                    <p className="text-gray-400 text-xl cursor-pointer">
                                      +
                                    </p>
                                  }
                                />
                              </div>
                              <IoChevronForward
                                className={cn(
                                  'text-xl duration-300 cursor-pointer text-gray-400',
                                  {
                                    'rotate-90': expandedSections.includes(
                                      section.id
                                    ),
                                  }
                                )}
                                onClick={() => handleExpandSection(section.id)}
                              />
                              <div style={{ flex: 2 }}>
                                <p className="text-sm font-bold tracking-tight text-black/80">
                                  {section.name}
                                </p>
                                <p className="text-gray-400 text-xs font-normal">
                                  ({getSectionTime(section.frames)})
                                </p>
                              </div>
                              <div
                                className={cn(
                                  'flex items-center justify-center',
                                  {
                                    'pr-2': !expandedSections.includes(
                                      section.id
                                    ),
                                  }
                                )}>
                                {editable && (
                                  <Switch
                                    size="sm"
                                    isSelected={section.frames.some(
                                      (frame) =>
                                        frame?.status === FrameStatus.PUBLISHED
                                    )}
                                    className="p-0"
                                    onChange={() =>
                                      changeSectionStatus(
                                        section,
                                        section.frames.some(
                                          (frame) =>
                                            frame?.status ===
                                            FrameStatus.PUBLISHED
                                        )
                                          ? FrameStatus.DRAFT
                                          : FrameStatus.PUBLISHED
                                      )
                                    }
                                    disabled={!isOwner}
                                  />
                                )}
                              </div>
                            </div>
                            {expandedSections.includes(section.id) && (
                              <FramesList section={section} />
                            )}
                          </div>
                        </Fragment>
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
      <div className="flex justify-center mt-4">
        <Button
          color="primary"
          variant="solid"
          isLoading={showSectionPlaceholder}
          onClick={() => addSection({ addToLast: true })}>
          Add Section
        </Button>
      </div>
    </div>
  )
}
