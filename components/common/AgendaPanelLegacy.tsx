/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react'

import { IconChevronRight } from '@tabler/icons-react'
import { HomeIcon } from 'lucide-react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button, Chip } from '@nextui-org/react'

import { AddItemDropdownActions } from './AddItemDropdownActions'
import { AddItemStickyDropdownActions } from './AddItemStickyDropdownActions'
import { AgendaFrameCard } from './AgendaFrameCard'
import { AgendaPanelSearch } from './AgendaPanelSearch'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { DisplayTypeSwitcher } from './DisplayTypeSwitcher'
import { EditableLabel } from './EditableLabel'
import { FramePlaceholder } from './FramePlaceholder'
import { SectionDropdownActions } from './SectionDropdownActions'
import { SectionPlaceholder } from './SectionPlaceholder'
import { StrictModeDroppable } from './StrictModeDroppable'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { type AgendaFrameDisplayType } from '@/types/event.type'
import { ISection, IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

const getFilteredFrames = ({
  frames,
  isOwner,
  eventMode = 'present',
}: {
  frames: IFrame[]
  isOwner: boolean
  eventMode: EventModeType
}) => {
  if (isOwner || eventMode === 'present') return frames

  return frames.filter((frame) => frame.status === 'PUBLISHED')
}

type AgendaPanelProps = {
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateActiveSession?: (data: any) => void
}

export function AgendaPanel({
  setOpenContentTypePicker,
  updateActiveSession,
}: AgendaPanelProps) {
  const [itemToDelete, setItemToDelete] = useState<ISection | null>(null)
  const [displayType, setDisplayType] =
    useState<AgendaFrameDisplayType>('thumbnail')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const {
    preview,
    currentFrame,
    eventMode,
    meeting,
    isOwner,
    sections,
    updateSection,
    setOverviewOpen,
    reorderFrame,
    reorderSection,
    deleteSection,
    setInsertInSectionId,
    setInsertAfterFrameId,
    setCurrentFrame,
    selectedSectionId,
    setSelectedSectionId,
  } = useContext(EventContext) as EventContextType

  useEffect(() => {
    if (selectedSectionId) {
      setExpandedSections([selectedSectionId])

      return
    }

    if (currentFrame) {
      const section = sections.find(
        (s) => s.id === currentFrame.section_id
      ) as ISection

      if (section) {
        setExpandedSections((prev) => {
          if (!prev.includes(section.id)) {
            return [...prev, section.id]
          }

          return prev
        })
      }
    }
  }, [currentFrame, sections, selectedSectionId])

  const handleExpandSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      if (!prev.includes(sectionId)) {
        return [...prev, sectionId]
      }

      return prev.filter((id) => id !== sectionId)
    })
  }

  const handleDeleteConfirmation = async () => {
    if (!itemToDelete) return
    await deleteSection({
      sectionId: itemToDelete.id,
      meetingId: meeting.id,
    })
    toast.success('Section deleted successfully')
    setItemToDelete(null)
  }

  const getDeleteConfirmationModalDescription = () => {
    if (!itemToDelete) return null
    if (itemToDelete.frames) {
      const frameCount = itemToDelete.frames.length

      if (frameCount === 0) return null

      return (
        <p>
          Are you sure to delete this section{' '}
          <strong>{itemToDelete.name}</strong>? This will also delete{' '}
          <strong>{frameCount}</strong> {frameCount > 1 ? 'frames' : 'frame'}.
        </p>
      )
    }

    if (itemToDelete.id) {
      return (
        <p>
          Are you sure to delete this frame <strong>{itemToDelete.name}</strong>
        </p>
      )
    }

    return null
  }

  const getFirstFrame = (sectionId: string) =>
    sections.find((section) => section.id === sectionId)?.frames?.[0]

  const onClickSection = ({ id }: { id: string }) => {
    setInsertInSectionId(id)
    setInsertAfterFrameId(null)
    setSelectedSectionId?.(id)
    const firstFrame = getFirstFrame(id)
    if (firstFrame) {
      setCurrentFrame(firstFrame)
    }
  }

  const expandAndCollapseSections = () => {
    if (expandedSections.length === 0) {
      setExpandedSections(sections.map((s) => s.id))

      return
    }

    setExpandedSections([])
  }

  const sectionCount = sections.length
  const firstSectionFramesCount = sections?.[0]?.frames?.length || 0
  const actionDisabled = eventMode !== 'edit' || !isOwner || preview

  useHotkeys('l', () => setDisplayType('list'), [])
  useHotkeys('g', () => setDisplayType('thumbnail'), [])
  useHotkeys('Minus', expandAndCollapseSections, [sections, expandedSections])

  return (
    <div className={cn('w-full bg-white h-full transition-all')}>
      <div className="flex flex-col justify-start items-center w-full p-2">
        <div className="flex justify-between items-center gap-2 px-2 pb-2 w-full">
          <div className="flex-grow">
            <AgendaPanelSearch onSearch={() => {}} />
          </div>
          <DisplayTypeSwitcher
            displayType={displayType}
            onDisplayTypeChange={setDisplayType}
          />
        </div>
        {!actionDisabled && (
          <div
            className="flex items-center gap-2 px-2 m-2 w-full cursor-pointer"
            onClick={() => setOverviewOpen(true)}>
            <HomeIcon size="18px" className="mr-1" />
            <p className="w-full outline-none max-w-[9.25rem] overflow-hidden !whitespace-nowrap text-sm">
              Overview
            </p>
          </div>
        )}
        <DragDropContext
          onDragEnd={(result, provide) => {
            if (!isOwner) return
            if (!result.destination) return

            if (result.type === 'section') reorderSection(result, provide)
            if (result.type === 'frame') reorderFrame(result, provide)
          }}>
          <StrictModeDroppable droppableId="section-droppable" type="section">
            {(sectionDroppableProvided) => (
              <div
                className={cn(
                  'flex flex-col justify-start items-center w-full flex-nowrap scrollbar-none overflow-y-auto',
                  {
                    'h-[calc(100vh_-_198px)]': !preview,
                    'h-[calc(100vh_-_120px)]': preview,
                  }
                )}
                ref={sectionDroppableProvided.innerRef}
                {...sectionDroppableProvided.droppableProps}>
                {sections.map((section, sectinIndex) => (
                  <Draggable
                    key={`section-draggable-${section.id}`}
                    draggableId={`section-draggable-sectionId-${section.id}`}
                    isDragDisabled={actionDisabled}
                    index={sectinIndex}>
                    {(sectionDraggableProvided) => (
                      <div
                        className="w-full"
                        ref={sectionDraggableProvided.innerRef}
                        {...sectionDraggableProvided.draggableProps}
                        {...sectionDraggableProvided.dragHandleProps}>
                        <React.Fragment key={section.id}>
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
                                    'cursor-grab': !actionDisabled,
                                  }
                                )}
                                {...frameProvided.droppableProps}>
                                <div className="w-full relative">
                                  <div className="w-full">
                                    <div
                                      className={cn(
                                        'flex justify-start items-center gap-0.5 p-1 rounded-sm',
                                        {
                                          hidden:
                                            sectionCount === 1 &&
                                            firstSectionFramesCount > 0,
                                          'bg-gray-200':
                                            selectedSectionId === section.id,
                                        }
                                      )}>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full"
                                        tabIndex={-1}
                                        className={cn('flex-none', {
                                          'rotate-90':
                                            snapshot.isDraggingOver ||
                                            expandedSections.includes(
                                              section.id
                                            ),
                                        })}
                                        onClick={() =>
                                          handleExpandSection(section.id)
                                        }>
                                        <IconChevronRight />
                                      </Button>
                                      <EditableLabel
                                        readOnly={actionDisabled}
                                        label={section.name}
                                        className="text-sm"
                                        onClick={() =>
                                          onClickSection({ id: section.id })
                                        }
                                        onUpdate={(value: string) => {
                                          updateSection({
                                            sectionPayload: { name: value },
                                            sectionId: section.id,
                                          })
                                        }}
                                      />
                                      <span className="flex-none">
                                        <Chip
                                          size="sm"
                                          className="aspect-square flex justify-center items-center">
                                          {
                                            getFilteredFrames({
                                              frames: section.frames,
                                              isOwner,
                                              eventMode,
                                            }).length
                                          }
                                        </Chip>
                                      </span>
                                      <SectionDropdownActions
                                        section={section}
                                        onDelete={setItemToDelete}
                                      />
                                    </div>
                                    <div>
                                      {(snapshot.isDraggingOver ||
                                        expandedSections.includes(section.id) ||
                                        sectionCount === 1) && (
                                        <div
                                          className={cn(
                                            'flex flex-col justify-start items-start w-full p-2 rounded-sm transition-all',
                                            {
                                              'gap-1':
                                                displayType === 'thumbnail',
                                              'gap-0 pt-[0.0625rem]':
                                                displayType === 'list',
                                            }
                                          )}>
                                          {getFilteredFrames({
                                            frames: section.frames,
                                            isOwner,
                                            eventMode,
                                          }).map((frame, frameIndex) => (
                                            <React.Fragment key={frame.id}>
                                              <Draggable
                                                key={`frame-draggable-${frame.id}`}
                                                draggableId={`frame-draggable-frameId-${frame.id}`}
                                                isDragDisabled={actionDisabled}
                                                index={frameIndex}>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {(_provided, _snapshot) => (
                                                  <div
                                                    ref={_provided.innerRef}
                                                    {..._provided.draggableProps}
                                                    {..._provided.dragHandleProps}
                                                    className={cn(
                                                      'relative last:pb-2',
                                                      {
                                                        'w-[86%]':
                                                          displayType ===
                                                          'thumbnail',
                                                        'w-full':
                                                          displayType ===
                                                          'list',
                                                      }
                                                    )}>
                                                    <AgendaFrameCard
                                                      frame={frame}
                                                      index={frameIndex}
                                                      draggableProps={
                                                        _provided.dragHandleProps
                                                      }
                                                      displayType={displayType}
                                                      isDragging={
                                                        _snapshot.isDragging
                                                      }
                                                      updateActiveSession={
                                                        updateActiveSession
                                                      }
                                                    />
                                                    <AddItemDropdownActions
                                                      className={cn({
                                                        'mt-[0.1875rem]':
                                                          displayType ===
                                                          'thumbnail',
                                                        '-my-2':
                                                          displayType ===
                                                          'list',
                                                      })}
                                                      sectionId={section.id}
                                                      frameId={frame.id}
                                                      hiddenActionKeys={[
                                                        'new-section',
                                                      ]}
                                                      hidden={
                                                        actionDisabled ||
                                                        _snapshot.isDragging ||
                                                        section.frames.length -
                                                          1 ===
                                                          frameIndex
                                                      }
                                                      onOpenContentTypePicker={
                                                        setOpenContentTypePicker
                                                      }
                                                    />
                                                  </div>
                                                )}
                                              </Draggable>
                                              {frame.id ===
                                                currentFrame?.id && (
                                                <FramePlaceholder />
                                              )}
                                            </React.Fragment>
                                          ))}
                                        </div>
                                      )}

                                      {frameProvided.placeholder}
                                    </div>
                                  </div>
                                  <AddItemDropdownActions
                                    className="-my-2"
                                    sectionId={section.id}
                                    hidden={actionDisabled}
                                    onOpenContentTypePicker={
                                      setOpenContentTypePicker
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </StrictModeDroppable>
                          {section.id === currentFrame?.section_id && (
                            <SectionPlaceholder />
                          )}
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
        <AddItemStickyDropdownActions
          onOpenContentTypePicker={setOpenContentTypePicker}
        />
      </div>
      <DeleteConfirmationModal
        open={!!itemToDelete}
        description={getDeleteConfirmationModalDescription()}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirmation}
      />
    </div>
  )
}
