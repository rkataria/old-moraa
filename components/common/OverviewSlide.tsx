/* eslint-disable react/no-danger */
import React, { useContext } from 'react'

import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MdDragIndicator, MdOutlineDragHandle } from 'react-icons/md'

import { Button, Switch } from '@nextui-org/react'

import { ContentTypeIcon } from './ContentTypeIcon'
import { EditableLabel } from './EditableLabel'
import { StrictModeDroppable } from './StrictModeDroppable'

import { EventContext } from '@/contexts/EventContext'
import { SlideStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISection, ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

export function OverviewSlide() {
  const {
    isOwner,
    sections,
    showSectionPlaceholder,
    updateSlide,
    updateSlides,
    reorderSection,
    reorderSlide,
    addSection,
  } = useContext(EventContext) as EventContextType

  const changeSlideStatus = (slide: ISlide) => {
    const newState =
      slide.status === SlideStatus.PUBLISHED
        ? SlideStatus.DRAFT
        : SlideStatus.PUBLISHED
    updateSlide({
      slideId: slide.id,
      slidePayload: {
        status: newState,
      },
    })
  }

  const changeSectionStatus = (
    section: ISection,
    newState: SlideStatus.DRAFT | SlideStatus.PUBLISHED
  ) => {
    updateSlides({
      slideIds: section.slides.map((slide) => slide.id),
      slidePayload: {
        status: newState,
      },
    })
  }

  const onSlideTitleChange = (slideId: string, title: string) => {
    updateSlide({
      slideId,
      slidePayload: {
        name: title,
      },
    })
  }

  return (
    <div className="p-4 flex flex-col flex-1 max-w-5xl m-auto">
      <h2 className="mb-2 font-bold text-xl">Overview</h2>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-md font-semibold">Agenda Outline</h4>
        <h4 className="font-md pl-4">Share</h4>
      </div>
      <div className="scrollbar-none overflow-y-auto">
        <DragDropContext
          onDragEnd={(result, provide) => {
            if (!isOwner) return
            if (!result.destination) return
            if (result.type === 'section') reorderSection(result, provide)
            if (result.type === 'slide') reorderSlide(result, provide)
          }}>
          <StrictModeDroppable droppableId="section-droppable" type="section">
            {(sectionDroppableProvided) => (
              <div
                className={cn(
                  'flex flex-col justify-start items-center gap-2 w-full flex-nowrap'
                )}
                ref={sectionDroppableProvided.innerRef}
                {...sectionDroppableProvided.droppableProps}>
                {sections.map((section, sectionIndex) => (
                  <Draggable
                    key={`section-draggable-${section.id}`}
                    draggableId={`section-draggable-sectionId-${section.id}`}
                    index={sectionIndex}>
                    {(sectionDraggableProvided) => (
                      <div
                        className="w-full"
                        ref={sectionDraggableProvided.innerRef}
                        {...sectionDraggableProvided.draggableProps}>
                        <React.Fragment key={section.id}>
                          <div className="mb-4 p-2 rounded-md border border-dotted border-gray-400">
                            <div className="flex w-full">
                              <div
                                className="p-2 flex items-center justify-center"
                                {...sectionDraggableProvided.dragHandleProps}>
                                <MdDragIndicator height={60} width={45} />
                              </div>
                              <div className="mr-2" style={{ flex: 2 }}>
                                <div className="p-2 h-full w-full flex flex-col">
                                  <p className="text-sm">{section.name}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center p-2 mr-2">
                                <Switch
                                  size="sm"
                                  isSelected={section.slides.some(
                                    (slide) =>
                                      slide.status === SlideStatus.PUBLISHED
                                  )}
                                  onChange={() =>
                                    changeSectionStatus(
                                      section,
                                      section.slides.some(
                                        (slide) =>
                                          slide.status === SlideStatus.PUBLISHED
                                      )
                                        ? SlideStatus.DRAFT
                                        : SlideStatus.PUBLISHED
                                    )
                                  }
                                  disabled={!isOwner}
                                />
                              </div>
                            </div>
                            <div className="ml-4">
                              <StrictModeDroppable
                                droppableId={`slide-droppable-sectionId-${section.id}`}
                                type="slide">
                                {(slideProvided, snapshot) => (
                                  <div
                                    key={`slide-draggable-${section.id}`}
                                    ref={slideProvided.innerRef}
                                    className={cn(
                                      'rounded-sm transition-all w-full',
                                      {
                                        'bg-gray-50': snapshot.isDraggingOver,
                                        // 'cursor-grab': !actionDisabled,
                                      }
                                    )}
                                    {...slideProvided.droppableProps}>
                                    <div className="w-full relative">
                                      <div className="w-full">
                                        <div>
                                          <div className="flex flex-col justify-start items-start gap-1 w-full px-2 pb-2 rounded-sm transition-all">
                                            {section.slides.map(
                                              (slide, slideIndex) => (
                                                <React.Fragment key={slide.id}>
                                                  <Draggable
                                                    key={`slide-draggable-${slide.id}`}
                                                    draggableId={`slide-draggable-slideId-${slide.id}`}
                                                    index={slideIndex}>
                                                    {(_provided) => (
                                                      <div
                                                        key={slide.id}
                                                        ref={_provided.innerRef}
                                                        {..._provided.draggableProps}
                                                        className="mt-2 flex w-full">
                                                        <div
                                                          className="p-2 flex items-center justify-center"
                                                          {..._provided.dragHandleProps}>
                                                          <MdOutlineDragHandle
                                                            height={40}
                                                            width={30}
                                                          />
                                                        </div>
                                                        <div
                                                          className="mr-2 rounded-md overflow-hidden border border-gray-400 flex items-center"
                                                          style={{ flex: 3 }}>
                                                          <ContentTypeIcon
                                                            classNames="m-2"
                                                            slideType={
                                                              slide.type
                                                            }
                                                          />
                                                          <div className="bg-white p-2 h-full w-full flex flex-col">
                                                            <EditableLabel
                                                              readOnly={false}
                                                              label={slide.name}
                                                              onUpdate={(
                                                                value
                                                              ) =>
                                                                onSlideTitleChange(
                                                                  slide.id,
                                                                  value
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center justify-center p-2">
                                                          <Switch
                                                            size="sm"
                                                            isSelected={
                                                              slide.status ===
                                                              SlideStatus.PUBLISHED
                                                            }
                                                            onChange={() =>
                                                              changeSlideStatus(
                                                                slide
                                                              )
                                                            }
                                                            disabled={!isOwner}
                                                          />
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                </React.Fragment>
                                              )
                                            )}
                                          </div>
                                          {slideProvided.placeholder}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </StrictModeDroppable>
                            </div>
                          </div>
                        </React.Fragment>
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
