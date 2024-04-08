/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react'

import {
  IconList,
  IconLayoutGrid,
  IconChevronRight,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react'
import {
  DragDropContext,
  type DroppableProps,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import { BsCardText, BsCollection, BsThreeDotsVertical } from 'react-icons/bs'

import { Button, Chip, Tooltip } from '@nextui-org/react'

import { AgendaSlideCard } from './AgendaSlideCard'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { DropdownActions } from './DropdownActions'
import { EditableLabel } from './EditableLabel'
import { SectionPlaceholder } from './SectionPlaceholder'
import { SlidePlaceholder } from './SlidePlaceholder'

import { EventContext } from '@/contexts/EventContext'
import { MeetingService } from '@/services/meeting.service'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { type AgendaSlideDisplayType } from '@/types/event.type'
import { ISection, ISlide } from '@/types/slide.type'
import { isSlideInteractive } from '@/utils/content.util'
import { cn } from '@/utils/utils'

const sectionDropdownActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrash className="h-4 w-4 text-red-500" />,
  },
  {
    key: 'move-up',
    label: 'Move up',
    icon: <IconArrowUp className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'move-down',
    label: 'Move down',
    icon: <IconArrowDown className="h-4 w-4 text-slate-500" />,
  },
]

const addItemDropdownActions = [
  {
    key: 'new-section',
    label: 'New Section',
    icon: <BsCollection className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'new-slide',
    label: 'New Slide',
    icon: <BsCardText className="h-4 w-4 text-slate-500" />,
  },
]

const getFilteredSlides = ({
  slides,
  isOwner,
  eventMode = 'present',
}: {
  slides: ISlide[]
  isOwner: boolean
  eventMode: EventModeType
}) => {
  if (isOwner || eventMode === 'present') return slides

  const nonInteractiveSlides = slides.filter(
    (slide) => !isSlideInteractive(slide)
  )

  return nonInteractiveSlides
}

function StrictModeDroppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) return null

  return <Droppable {...props}>{children}</Droppable>
}

type AgendaPanelProps = {
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
}

export function AgendaPanel({ setOpenContentTypePicker }: AgendaPanelProps) {
  const [itemToDelete, setItemToDelete] = useState<ISection | null>(null)
  const [displayType, setDisplayType] = useState<AgendaSlideDisplayType>('list')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const {
    eventMode,
    meeting,
    isOwner,
    sections,
    currentSection,
    showSectionPlaceholder,
    insertInSectionId,
    addSection,
    updateSection,
    setInsertAfterSectionId,
    setInsertAfterSlideId,
    reorderSlide,
    setInsertInSectionId,
    moveUpSection,
    moveDownSection,
  } = useContext(EventContext) as EventContextType

  useEffect(() => {
    setExpandedSections(currentSection ? [currentSection.id] : [])
  }, [currentSection])

  useEffect(() => {
    if (insertInSectionId) {
      setExpandedSections([...expandedSections, insertInSectionId])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertInSectionId])

  const handleExpandSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  const handleDeleteConfirmation = async () => {
    if (!itemToDelete) return

    if (itemToDelete.slides) {
      const response = await MeetingService.updateMeeting({
        meetingPayload: {
          sections: meeting.sections.filter(
            (id: string) => id !== itemToDelete.id
          ),
        },
        meetingId: meeting.id,
      })

      if (response?.error) {
        toast.error('Failed to selete section')
        setItemToDelete(null)

        return
      }
      toast.success('Section deleted successfully')
      setItemToDelete(null)
    }
  }

  const getDeleteConfirmationModalDescription = () => {
    if (!itemToDelete) return null
    if (itemToDelete.slides) {
      const slideCount = itemToDelete.slides.length

      if (slideCount === 0) return null

      return (
        <p>
          Are you sure to delete this section{' '}
          <strong>{itemToDelete.name}</strong>? This will also delete{' '}
          <strong>{slideCount}</strong> {slideCount > 1 ? 'slides' : 'slide'}.
        </p>
      )
    }

    if (itemToDelete.id) {
      return (
        <p>
          Are you sure to delete this slide <strong>{itemToDelete.name}</strong>
        </p>
      )
    }

    return null
  }

  const sectionCount = sections.length
  const firstSectionSlidesCount = sections?.[0]?.slides?.length || 0

  return (
    <div className={cn('w-full bg-white/95 h-full transition-all')}>
      <div className="flex flex-col justify-start items-center w-full p-2 pb-0">
        <DisplayTypeSwitcher
          displayType={displayType}
          onDisplayTypeChange={setDisplayType}
        />
        <DragDropContext
          onDragEnd={(result, provide) => {
            setIsDragging(false)
            reorderSlide(result, provide)
          }}
          onDragStart={() => {
            setIsDragging(true)
          }}>
          <StrictModeDroppable droppableId="section-droppable" type="section">
            {(sectionProvided) => (
              <div
                className="flex flex-col justify-start items-center gap-6 w-full flex-nowrap scrollbar-none overflow-y-auto h-[calc(100vh_-_112px)]"
                ref={sectionProvided.innerRef}
                {...sectionProvided.droppableProps}>
                {sections.map((section) => (
                  <React.Fragment key={section.id}>
                    <StrictModeDroppable
                      droppableId={`slide-droppable-sectionId-${section.id}`}
                      type="slide">
                      {(slideProvided, snapshot) => (
                        <div
                          key={`slide-draggable-${section.id}`}
                          ref={slideProvided.innerRef}
                          className={cn(
                            'rounded-sm transition-all w-full',
                            snapshot.isDraggingOver ? 'bg-gray-100' : ''
                          )}
                          {...slideProvided.droppableProps}>
                          <div className="w-full relative">
                            <div className="w-full">
                              <div
                                className={cn(
                                  'flex justify-start items-center gap-2 px-1',
                                  {
                                    hidden:
                                      sectionCount === 1 &&
                                      firstSectionSlidesCount > 0,
                                  }
                                )}>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  radius="full"
                                  className={cn({
                                    'rotate-90':
                                      snapshot.isDraggingOver ||
                                      expandedSections.includes(section.id),
                                  })}
                                  onClick={() =>
                                    handleExpandSection(section.id)
                                  }>
                                  <IconChevronRight />
                                </Button>
                                <EditableLabel
                                  readOnly={!isOwner}
                                  label={section.name}
                                  onUpdate={(value: string) => {
                                    updateSection({
                                      sectionPayload: { name: value },
                                      sectionId: section.id,
                                    })
                                  }}
                                />
                                <span className="flex-none">
                                  <Chip size="sm" className="aspect-square">
                                    {section.slides.length}
                                  </Chip>
                                </span>
                                {isOwner && (
                                  <DropdownActions
                                    triggerIcon={
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full">
                                        <BsThreeDotsVertical />
                                      </Button>
                                    }
                                    actions={sectionDropdownActions}
                                    onAction={(actionKey) => {
                                      if (actionKey === 'delete') {
                                        setItemToDelete(section)
                                      }
                                      if (actionKey === 'move-up') {
                                        moveUpSection(section)
                                      }
                                      if (actionKey === 'move-down') {
                                        moveDownSection(section)
                                      }
                                    }}
                                  />
                                )}
                              </div>
                              <div>
                                {(snapshot.isDraggingOver ||
                                  expandedSections.includes(section.id) ||
                                  sectionCount === 1) && (
                                  <div className="flex flex-col justify-start items-center gap-6 w-full p-2 rounded-sm transition-all">
                                    {getFilteredSlides({
                                      slides: section.slides,
                                      isOwner,
                                      eventMode,
                                    }).map((slide, slideIndex) => (
                                      <React.Fragment key={slide.id}>
                                        <Draggable
                                          key={`slide-draggable-${slide.id}`}
                                          draggableId={`slide-draggable-slideId-${slide.id}`}
                                          isDragDisabled={!isOwner}
                                          index={slideIndex}>
                                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                          {(_provided, _snapshot) => (
                                            <div
                                              ref={_provided.innerRef}
                                              {..._provided.draggableProps}
                                              {..._provided.dragHandleProps}
                                              className="w-full relative">
                                              <AgendaSlideCard
                                                slide={slide}
                                                index={slideIndex}
                                                draggableProps={
                                                  _provided.dragHandleProps
                                                }
                                                displayType={displayType}
                                                isDragging={
                                                  _snapshot.isDragging
                                                }
                                              />
                                              {!isDragging &&
                                                section.slides.length - 1 !==
                                                  slideIndex &&
                                                isOwner && (
                                                  <DropdownActions
                                                    triggerIcon={
                                                      <div
                                                        className="flex-none absolute -bottom-5 left-0 py-1.5 h-4 w-full px-2 group cursor-pointer"
                                                        onClick={() => {
                                                          setInsertInSectionId(
                                                            section.id
                                                          )
                                                          setInsertAfterSlideId(
                                                            slide.id
                                                          )
                                                        }}>
                                                        <div className="w-full h-1 bg-gray-50 group-hover:bg-gray-200 rounded-full" />
                                                      </div>
                                                    }
                                                    actions={addItemDropdownActions.filter(
                                                      (item) =>
                                                        item.key === 'new-slide'
                                                    )}
                                                    onAction={(actionKey) => {
                                                      if (
                                                        actionKey ===
                                                        'new-slide'
                                                      ) {
                                                        setInsertAfterSlideId(
                                                          slide.id
                                                        )
                                                        setInsertInSectionId(
                                                          section.id
                                                        )
                                                        setOpenContentTypePicker?.(
                                                          true
                                                        )
                                                      }
                                                    }}
                                                  />
                                                )}
                                            </div>
                                          )}
                                        </Draggable>
                                        <SlidePlaceholder
                                          slideId={slide.id}
                                          displayType={displayType}
                                        />
                                      </React.Fragment>
                                    ))}
                                  </div>
                                )}

                                {slideProvided.placeholder}
                              </div>
                            </div>
                            {!showSectionPlaceholder && isOwner && (
                              <DropdownActions
                                triggerIcon={
                                  <div
                                    className="flex-none absolute -bottom-5 left-0 py-1.5 h-4 w-full px-2 group cursor-pointer"
                                    onClick={() => {
                                      setInsertAfterSectionId(section.id)
                                    }}>
                                    <div className="w-full h-1 bg-gray-50 group-hover:bg-gray-200 rounded-full" />
                                  </div>
                                }
                                actions={addItemDropdownActions}
                                onAction={(actionKey) => {
                                  if (actionKey === 'new-section') {
                                    addSection({
                                      afterSectionId: section.id,
                                    })
                                  }
                                  if (actionKey === 'new-slide') {
                                    setInsertInSectionId(section.id)
                                    setOpenContentTypePicker?.(true)
                                  }
                                }}
                              />
                            )}
                          </div>
                          <SectionPlaceholder sectionId={section.id} />
                        </div>
                      )}
                    </StrictModeDroppable>
                  </React.Fragment>
                ))}
                {sectionProvided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
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

function DisplayTypeSwitcher({
  displayType,
  onDisplayTypeChange,
}: {
  displayType: AgendaSlideDisplayType
  onDisplayTypeChange: (view: AgendaSlideDisplayType) => void
}) {
  return (
    <div className="flex items-center gap-4 justify-end w-full pb-4">
      <Tooltip content="Thumbnail View">
        <IconLayoutGrid
          className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
            'text-slate-500': displayType === 'thumbnail',
            'text-slate-300': displayType !== 'thumbnail',
          })}
          onClick={() => onDisplayTypeChange('thumbnail')}
        />
      </Tooltip>
      <Tooltip content="List View">
        <IconList
          className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
            'text-slate-500': displayType === 'list',
            'text-slate-300': displayType !== 'list',
          })}
          onClick={() => onDisplayTypeChange('list')}
        />
      </Tooltip>
    </div>
  )
}
