/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react'

import { IconChevronRight } from '@tabler/icons-react'
import {
  DragDropContext,
  type DroppableProps,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd'
import toast from 'react-hot-toast'

import { Button, Chip } from '@nextui-org/react'

import { AddItemDropdownActions } from './AddItemDropdownActions'
import { AddItemStickyDropdownActions } from './AddItemStickyDropdownActions'
import { AgendaSlideCard } from './AgendaSlideCard'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { DisplayTypeSwitcher } from './DisplayTypeSwitcher'
import { EditableLabel } from './EditableLabel'
import { SectionDropdownActions } from './SectionDropdownActions'
import { SectionPlaceholder } from './SectionPlaceholder'
import { SlidePlaceholder } from './SlidePlaceholder'

import { EventContext } from '@/contexts/EventContext'
import { MeetingService } from '@/services/meeting.service'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { type AgendaSlideDisplayType } from '@/types/event.type'
import { ISection, ISlide } from '@/types/slide.type'
import { isSlideInteractive } from '@/utils/content.util'
import { cn } from '@/utils/utils'

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
  const {
    preview,
    currentSlide,
    eventMode,
    meeting,
    isOwner,
    sections,
    currentSection,
    insertAfterSlideId,
    insertInSectionId,
    insertAfterSectionId,
    updateSection,
    reorderSlide,
  } = useContext(EventContext) as EventContextType

  useEffect(() => {
    setExpandedSections(currentSection ? [currentSection.id] : [])
  }, [currentSection])

  useEffect(() => {
    if (currentSlide) {
      const section = sections.find(
        (s) => s.id === currentSlide.section_id
      ) as ISection

      if (section) {
        setExpandedSections([section.id])
      }
    }
  }, [currentSlide, sections])

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
  const actionDisabled = eventMode !== 'edit' || !isOwner || preview

  return (
    <div className={cn('w-full bg-white/95 h-full transition-all')}>
      <div className="flex flex-col justify-start items-center w-full p-2">
        <DisplayTypeSwitcher
          displayType={displayType}
          onDisplayTypeChange={setDisplayType}
        />
        <DragDropContext
          onDragEnd={(result, provide) => {
            reorderSlide(result, provide)
          }}>
          <StrictModeDroppable droppableId="section-droppable" type="section">
            {(sectionProvided) => (
              <div
                className="flex flex-col justify-start items-center gap-6 w-full flex-nowrap scrollbar-none overflow-y-auto h-[calc(100vh_-_168px)]"
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
                                  readOnly={actionDisabled}
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
                                <SectionDropdownActions
                                  section={section}
                                  onDelete={setItemToDelete}
                                />
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
                                          isDragDisabled={actionDisabled}
                                          index={slideIndex}>
                                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                          {(_provided, _snapshot) => (
                                            <div
                                              ref={_provided.innerRef}
                                              {..._provided.draggableProps}
                                              {..._provided.dragHandleProps}
                                              className={cn(
                                                'w-full relative border-2 border-transparent rounded-sm',
                                                {
                                                  'border-gray-200':
                                                    displayType === 'list' &&
                                                    currentSlide?.id ===
                                                      slide.id,
                                                }
                                              )}>
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
                                              <AddItemDropdownActions
                                                sectionId={section.id}
                                                slideId={slide.id}
                                                hiddenActionKeys={[
                                                  'new-section',
                                                ]}
                                                hidden={
                                                  actionDisabled ||
                                                  _snapshot.isDragging ||
                                                  section.slides.length - 1 ===
                                                    slideIndex
                                                }
                                                onOpenContentTypePicker={
                                                  setOpenContentTypePicker
                                                }
                                              />
                                            </div>
                                          )}
                                        </Draggable>
                                        {slide.id === insertAfterSlideId && (
                                          <SlidePlaceholder
                                            displayType={displayType}
                                          />
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                )}

                                {slideProvided.placeholder}
                              </div>
                            </div>
                            <AddItemDropdownActions
                              sectionId={section.id}
                              hidden={actionDisabled}
                              onOpenContentTypePicker={setOpenContentTypePicker}
                            />
                          </div>
                        </div>
                      )}
                    </StrictModeDroppable>
                    {section.id === insertAfterSectionId && (
                      <SectionPlaceholder />
                    )}
                  </React.Fragment>
                ))}
                {sectionProvided.placeholder}
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
