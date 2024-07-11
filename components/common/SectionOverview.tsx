/* eslint-disable react/no-danger */
import React, { Fragment, useContext } from 'react'

import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MdDragIndicator, MdOutlineDragHandle } from 'react-icons/md'

import { Button, Switch } from '@nextui-org/react'

import { BREAKOUT_TYPES } from './BreakoutTypePicker'
import { ContentTypeIcon } from './ContentTypeIcon'
import { ContentType } from './ContentTypePicker'
import { EditableLabel } from './EditableLabel'
import { RenderIf } from './RenderIf/RenderIf'
import { StrictModeDroppable } from './StrictModeDroppable'

import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISection, IFrame } from '@/types/frame.type'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

export function SectionOverview() {
  const {
    isOwner,
    sections,
    currentSectionId,
    preview,
    eventMode,
    showSectionPlaceholder,
    updateFrame,
    updateFrames,
    reorderSection,
    reorderFrame,
    setOpenContentTypePicker,
    setInsertInSectionId,
  } = useContext(EventContext) as EventContextType

  const filteredSections = sections.filter((s) => s.id === currentSectionId)

  const changeFrameStatus = (frame: IFrame) => {
    if (!isOwner) return

    const newState =
      frame.status === FrameStatus.PUBLISHED
        ? FrameStatus.DRAFT
        : FrameStatus.PUBLISHED
    updateFrame({
      frameId: frame.id,
      framePayload: {
        status: newState,
      },
    })
    if (
      frame.type === ContentType.BREAKOUT &&
      frame?.content?.breakoutDetails?.length
    ) {
      if (frame?.config?.selectedBreakout === BREAKOUT_TYPES.ROOMS) {
        frame?.content?.breakoutDetails?.map((ele) => {
          if (ele?.activityId) {
            updateFrame({
              frameId: ele?.activityId,
              framePayload: {
                status: newState,
              },
            })
          }

          return ele
        })
      } else if (frame?.config?.selectedBreakout === BREAKOUT_TYPES.GROUPS) {
        if (frame?.content?.activityId) {
          updateFrame({
            frameId: frame?.content?.activityId,
            framePayload: {
              status: newState,
            },
          })
        }
      }
    }
  }

  const changeSectionStatus = (
    section: ISection,
    newState: FrameStatus.DRAFT | FrameStatus.PUBLISHED
  ) => {
    if (!isOwner) return
    updateFrames({
      frameIds: section.frames.map((frame) => frame.id),
      framePayload: {
        status: newState,
      },
    })
  }

  const onFrameTitleChange = (frameId: string, title: string) => {
    if (!isOwner) return
    updateFrame({
      frameId,
      framePayload: {
        name: title,
      },
    })
  }

  const editable = isOwner && !preview && eventMode === 'edit'

  const filteredFrames = getFilteredFramesByStatus({
    frames: filteredSections[0].frames,
    status: editable ? null : FrameStatus.PUBLISHED,
  })

  return (
    <div className="flex flex-col flex-1 max-w-5xl m-auto p-4 pt-14">
      <h2 className="mb-2 font-bold text-xl">Section Overview</h2>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-md font-semibold">Outline</h4>
        {editable && <h4 className="font-md pl-4">Share</h4>}
      </div>
      <div className="scrollbar-none overflow-y-auto">
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
                  'flex flex-col justify-start items-center gap-2 w-full flex-nowrap'
                )}
                ref={sectionDroppableProvided.innerRef}
                {...sectionDroppableProvided.droppableProps}>
                {filteredSections.map((section, sectionIndex) => (
                  <Draggable
                    key={`section-draggable-${section.id}`}
                    draggableId={`section-draggable-sectionId-${section.id}`}
                    isDragDisabled={!editable}
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
                                <div className="p-2 h-full w-full flex flex-col justify-center">
                                  <p className="text-sm font-bold">
                                    {section.name}
                                  </p>
                                </div>
                              </div>
                              {editable && (
                                <div className="flex items-center justify-center p-2 mr-2">
                                  <Switch
                                    size="sm"
                                    isSelected={section.frames.some(
                                      (frame) =>
                                        frame?.status === FrameStatus.PUBLISHED
                                    )}
                                    onChange={() =>
                                      changeSectionStatus(
                                        section,
                                        section.frames.some(
                                          (frame) =>
                                            frame.status ===
                                            FrameStatus.PUBLISHED
                                        )
                                          ? FrameStatus.DRAFT
                                          : FrameStatus.PUBLISHED
                                      )
                                    }
                                    disabled={!editable}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <StrictModeDroppable
                                droppableId={`frame-droppable-sectionId-${section.id}`}
                                type="frame">
                                {(frameProvided, snapshot) => (
                                  <div
                                    key={`frame-draggable-${section.id}`}
                                    ref={frameProvided.innerRef}
                                    className={cn(
                                      'rounded-sm transition-all w-full',
                                      {
                                        'bg-gray-50': snapshot.isDraggingOver,
                                        // 'cursor-grab': !actionDisabled,
                                      }
                                    )}
                                    {...frameProvided.droppableProps}>
                                    <div className="w-full relative">
                                      <div className="w-full">
                                        <div>
                                          <div className="flex flex-col justify-start items-start gap-1 w-full px-2 pb-2 rounded-sm transition-all">
                                            {filteredFrames.map(
                                              (frame, frameIndex) =>
                                                frame && (
                                                  <RenderIf
                                                    isTrue={
                                                      frame &&
                                                      !frame?.content
                                                        ?.breakoutFrameId
                                                    }>
                                                    <Fragment key={frame.id}>
                                                      <Draggable
                                                        key={`frame-draggable-${frame.id}`}
                                                        draggableId={`frame-draggable-frameId-${frame.id}`}
                                                        isDragDisabled={
                                                          !editable
                                                        }
                                                        index={frameIndex}>
                                                        {(_provided) => (
                                                          <div
                                                            key={frame.id}
                                                            ref={
                                                              _provided.innerRef
                                                            }
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
                                                              style={{
                                                                flex: 3,
                                                              }}>
                                                              <ContentTypeIcon
                                                                classNames="m-2"
                                                                frameType={
                                                                  frame.type
                                                                }
                                                              />
                                                              <div className="bg-white p-2 h-full w-full flex flex-col">
                                                                <EditableLabel
                                                                  readOnly={
                                                                    !editable
                                                                  }
                                                                  label={
                                                                    frame.name
                                                                  }
                                                                  onUpdate={(
                                                                    value
                                                                  ) =>
                                                                    onFrameTitleChange(
                                                                      frame.id,
                                                                      value
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            </div>
                                                            {editable && (
                                                              <div className="flex items-center justify-center p-2">
                                                                <Switch
                                                                  size="sm"
                                                                  isSelected={
                                                                    frame.status ===
                                                                    FrameStatus.PUBLISHED
                                                                  }
                                                                  onChange={() =>
                                                                    changeFrameStatus(
                                                                      frame
                                                                    )
                                                                  }
                                                                  disabled={
                                                                    !isOwner
                                                                  }
                                                                />
                                                              </div>
                                                            )}
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    </Fragment>
                                                  </RenderIf>
                                                )
                                            )}
                                          </div>
                                          {frameProvided.placeholder}
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
      {editable && (
        <div className="flex justify-center mt-4">
          <Button
            color="primary"
            variant="solid"
            isLoading={showSectionPlaceholder}
            onClick={() => {
              setInsertInSectionId(currentSectionId)
              setOpenContentTypePicker?.(true)
            }}>
            Add Frame
          </Button>
        </div>
      )}
    </div>
  )
}
