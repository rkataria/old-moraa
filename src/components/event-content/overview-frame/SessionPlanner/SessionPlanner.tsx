/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-danger */
import {
  useContext,
  useState,
  Fragment,
  ReactNode,
  useRef,
  Key,
  useEffect,
} from 'react'

import { Button, Switch } from '@nextui-org/react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { IoIosArrowRoundUp } from 'react-icons/io'
import { IoChevronForward } from 'react-icons/io5'
import { MdDragIndicator } from 'react-icons/md'
import { RxReset } from 'react-icons/rx'

import { SessionColorTracker } from './ColorTracker'
import { FramesList } from './FramesList'
import { SectionTime } from './SectionTime'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { DropdownActions } from '@/components/common/DropdownActions'
import { EditableLabel } from '@/components/common/EditableLabel'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { EventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { handleExpandedSectionsInSessionPlannerAction } from '@/stores/slices/event/current-event/section.slice'
import { bulkUpdateFrameStatusThunk } from '@/stores/thunks/frame.thunks'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'
import { cn, sortByStatus } from '@/utils/utils'

export function SessionPlanner({
  className,
  header,
}: {
  className?: string
  header?: ReactNode
}) {
  const plannerRef = useRef<HTMLDivElement | null>(null)

  const { width: plannerWidth } = useDimensions(plannerRef)

  const {
    sections,
    preview,
    eventMode,
    reorderSection,
    reorderFrame,
    updateSection,
    setAddedFromSessionPlanner,
    insertInSectionId,
    setInsertInSectionId,
    setInsertAfterFrameId,
  } = useContext(EventContext) as EventContextType

  const dispatch = useStoreDispatch()

  const [filteredSections, setFilteredSections] = useState(sections)
  const { permissions } = useEventPermissions()

  const expandedSections = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.expandedSectionsInSessionPlanner
  )

  useEffect(() => {
    setFilteredSections(sections.filter((f) => f.id.length > 0))
  }, [sections])

  const changeSectionStatus = (
    section: ISection,
    newState: FrameStatus.DRAFT | FrameStatus.PUBLISHED
  ) => {
    if (!permissions.canUpdateFrame) return

    dispatch(
      bulkUpdateFrameStatusThunk({
        frameIds: section.frames.map((frame) => frame.id),
        status: newState,
      })
    )
  }

  const handleSectionSorting = (sectionId: string, criteria: Key) => {
    const updatedSections = sections.map((section) => ({
      ...section,
      frames: [...section.frames],
    }))

    const sectionIndex = updatedSections.findIndex(
      (section) => section.id === sectionId
    )

    if (sectionIndex === -1) return

    switch (criteria) {
      case 'published':
        updatedSections[sectionIndex].frames.sort((a, b) =>
          sortByStatus(a, b, 'PUBLISHED')
        )
        break
      case 'unpublished':
        updatedSections[sectionIndex].frames.sort((a, b) =>
          sortByStatus(a, b, 'DRAFT')
        )
        break
      case 'reset':
        setFilteredSections([...sections])

        return
      default:
        return
    }

    setFilteredSections(updatedSections)
  }

  const handleSectionClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    sectionId: string
  ) => {
    e.stopPropagation()
    if (insertInSectionId === sectionId) return
    setInsertInSectionId(sectionId)
    setInsertAfterFrameId(null)
    // dispatch(setCurrentFrameIdAction(null))
  }

  const editable =
    permissions.canUpdateSection && !preview && eventMode === 'edit'

  if (!permissions.canUpdateSection) return null

  return (
    <div
      ref={plannerRef}
      className={cn('flex flex-col flex-1 bg-white pl-4 pb-8', className)}>
      {header}
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
                  'flex flex-col justify-start items-center gap-[6px] w-full flex-nowrap '
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
                        className={cn('w-full bg-gray-100 rounded-lg border ', {
                          'border-l-8 border-r-8 border-b-8 shadow-sm':
                            expandedSections.includes(section.id),
                          'border-primary-100':
                            insertInSectionId === section.id && !preview,
                        })}
                        ref={sectionDraggableProvided.innerRef}
                        onClick={(e) => handleSectionClick(e, section.id)}
                        {...sectionDraggableProvided.draggableProps}>
                        <Fragment key={section.id}>
                          <div>
                            <div
                              className={cn(
                                'flex w-full items-center bg-white gap-2 p-2 border-b group/section',
                                {
                                  'rounded-lg': !expandedSections.includes(
                                    section.id
                                  ),
                                }
                              )}>
                              <div
                                className={cn(
                                  'flex flex-col items-center justify-center -ml-[45px] -mr-[2px] w-[2.5rem] opacity-0 group-hover/section:opacity-100',
                                  {
                                    '-ml-[39px] -mr-2':
                                      !expandedSections.includes(section.id),
                                  }
                                )}>
                                <RenderIf isTrue={!preview}>
                                  <div className="relative h-[18px]">
                                    <DropdownActions
                                      triggerIcon={
                                        <Button
                                          isIconOnly
                                          variant="light"
                                          className="w-auto h-auto min-w-1"
                                          {...sectionDraggableProvided.dragHandleProps}>
                                          <MdDragIndicator className="text-base text-gray-400" />
                                        </Button>
                                      }
                                      actions={[
                                        {
                                          key: 'published',
                                          label: 'Move published frames at top',
                                          icon: <IoIosArrowRoundUp />,
                                        },
                                        {
                                          key: 'unpublished',
                                          label:
                                            'Move Unpublished frames at top',
                                          icon: (
                                            <IoIosArrowRoundUp className="rotate-180" />
                                          ),
                                        },
                                        {
                                          key: 'reset',
                                          label: 'Reset',
                                          icon: <RxReset />,
                                        },
                                      ]}
                                      onAction={(key) =>
                                        handleSectionSorting(section.id, key)
                                      }
                                    />
                                  </div>
                                </RenderIf>

                                <AddItemBar
                                  sectionId={section.id}
                                  frameId={
                                    section.frames?.[section.frames.length - 1]
                                      ?.id
                                  }
                                  trigger={
                                    <p
                                      className="text-xl text-gray-400 cursor-pointer"
                                      onClick={() =>
                                        setAddedFromSessionPlanner(true)
                                      }>
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
                                onClick={() =>
                                  dispatch(
                                    handleExpandedSectionsInSessionPlannerAction(
                                      { id: section.id }
                                    )
                                  )
                                }
                              />
                              <div style={{ flex: 2 }}>
                                <EditableLabel
                                  showTooltip={false}
                                  className="text-sm font-bold tracking-tight text-primary/80 max-w-[31.25rem]"
                                  label={section.name}
                                  readOnly={preview}
                                  onUpdate={(value: string) => {
                                    updateSection({
                                      sectionPayload: { name: value },
                                      sectionId: section.id,
                                    })
                                  }}
                                />

                                <SectionTime
                                  sectionId={section.id}
                                  frames={section.frames}
                                  config={section.config}
                                />
                              </div>

                              <div
                                className={cn(
                                  'flex justify-between items-center gap-2 w-[18.75rem]',
                                  {
                                    'justify-end': !editable,
                                  }
                                )}>
                                <SessionColorTracker
                                  colorCodes={section.frames.map((frame) => ({
                                    colorCode: frame?.config?.colorCode,
                                    timeSpan: frame?.config?.time,
                                  }))}
                                  className="h-4 w-[18.75rem]"
                                />
                                <RenderIf isTrue={editable}>
                                  <div
                                    className={cn(
                                      'flex items-center justify-center',
                                      {
                                        'pr-2': !expandedSections.includes(
                                          section.id
                                        ),
                                      }
                                    )}>
                                    <Tooltip
                                      content="Toggle to share or unshare all frames simultaneously"
                                      color="primary"
                                      showArrow
                                      radius="sm">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm text-primary/80">
                                          {!section.frames.some(
                                            (frame) =>
                                              frame?.status ===
                                              FrameStatus.DRAFT
                                          )
                                            ? 'Unshare'
                                            : 'Share'}
                                        </p>
                                        <Switch
                                          size="sm"
                                          isSelected={
                                            !section.frames.some(
                                              (frame) =>
                                                frame?.status ===
                                                FrameStatus.DRAFT
                                            )
                                          }
                                          className="p-0"
                                          onChange={() =>
                                            changeSectionStatus(
                                              section,
                                              !section.frames.some(
                                                (frame) =>
                                                  frame?.status ===
                                                  FrameStatus.DRAFT
                                              )
                                                ? FrameStatus.DRAFT
                                                : FrameStatus.PUBLISHED
                                            )
                                          }
                                          disabled={
                                            !permissions.canUpdateSection
                                          }
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                </RenderIf>
                              </div>
                            </div>
                            <RenderIf
                              isTrue={expandedSections.includes(section.id)}>
                              <FramesList
                                section={section}
                                plannerWidth={plannerWidth}
                              />
                            </RenderIf>
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
    </div>
  )
}
