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

import { Button, Image } from '@nextui-org/react'
import differenceby from 'lodash.differenceby'
import isEqual from 'lodash.isequal'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { BiCollapseVertical } from 'react-icons/bi'
import { BsChevronExpand, BsTrash } from 'react-icons/bs'
import { IoChevronDown } from 'react-icons/io5'
import { MdAdd, MdDragIndicator } from 'react-icons/md'

import { SessionColorTracker } from './ColorTracker'
import { FramesList } from './FramesList'
import { SectionTime } from './SectionTime'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { DropdownActions } from '@/components/common/DropdownActions'
import { EditableLabel } from '@/components/common/EditableLabel'
import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Loading } from '@/components/common/Loading'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import {
  setExpandedSectionsInPlannerAction,
  toggleSectionExpansionInPlannerAction,
} from '@/stores/slices/event/current-event/section.slice'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'
import { getBlankFrame } from '@/utils/content.util'
import { cn, sortByStatus } from '@/utils/utils'

export function SessionPlanner({
  className,
  header,
}: {
  className?: string
  header?: ReactNode
}) {
  const plannerRef = useRef<HTMLDivElement | null>(null)

  const {
    sections,
    preview,
    eventMode,
    insertInSectionId,
    reorderSection,
    reorderFrame,
    updateSection,
    setAddedFromSessionPlanner,
    setInsertInSectionId,
    deleteSection,
    setInsertAfterFrameId,
    setInsertAfterSectionId,
    addSection,
    addFrameToSection,
  } = useContext(EventContext) as EventContextType

  const dispatch = useStoreDispatch()

  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )

  const [filteredSections, setFilteredSections] = useState(sections)
  const { permissions } = useEventPermissions()
  const [itemIdToBeFocus, setItemIdToBeFocus] = useState('')

  const expandedSections = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.expandedSectionsInSessionPlanner
  )

  const allSectionsCollapsed = expandedSections.length === 0

  const getNewlyAddedIds = (
    updatedSections: ISection[],
    previousSections: ISection[]
  ) => {
    const newSections: ISection[] = differenceby(
      updatedSections,
      previousSections,
      'id'
    )
    if (newSections.length > 0) {
      return newSections.map((section) => section.id)
    }

    return sections.flatMap((section) => {
      const filteredSection: ISection | undefined = previousSections.find(
        (s) => s.id === section.id
      )
      const frames: IFrame[] = filteredSection
        ? differenceby(section.frames, filteredSection.frames, 'id')
        : section.frames

      return frames.map((frame) => frame.id)
    })
  }

  useEffect(() => {
    if (isEqual(sections, filteredSections)) return

    setItemIdToBeFocus(getNewlyAddedIds(sections, filteredSections)?.[0])

    setFilteredSections(sections.filter((f) => f.id.length > 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, filteredSections])

  const handleSectionDropdownActions = (sectionId: string, key: Key) => {
    if (key === 'delete') {
      deleteSection({ sectionId })

      return
    }

    if (key === 'toggle-expand-collapse') {
      dispatch(
        setExpandedSectionsInPlannerAction({
          ids: allSectionsCollapsed
            ? sections.map((section) => section.id)
            : [],
        })
      )

      return
    }

    handleFramesSort(sectionId, key)
  }

  const handleFramesSort = (sectionId: string, criteria: Key) => {
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
      className={cn('flex flex-col flex-1 w-full px-10', className)}>
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
                  'flex flex-col justify-start items-center w-full flex-nowrap',
                  {
                    'gap-5': !editable,
                  }
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
                        className="w-full rounded-lg"
                        ref={sectionDraggableProvided.innerRef}
                        onClick={(e) => handleSectionClick(e, section.id)}
                        {...sectionDraggableProvided.draggableProps}>
                        <Fragment key={section.id}>
                          <div>
                            <div
                              className={cn(
                                'flex w-full items-center gap-2 p-2 group/section',
                                {
                                  'rounded-lg border bg-white':
                                    !expandedSections.includes(section.id),
                                  'pb-0': editable,
                                  'bg-transparent': expandedSections.includes(
                                    section.id
                                  ),
                                }
                              )}>
                              <div
                                className={cn(
                                  'flex flex-col items-center justify-center -ml-[38px] -mr-[12px] w-[2.5rem] opacity-0 group-hover/section:opacity-100',
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
                                          key: 'delete',
                                          label: 'Delete section',
                                          icon: (
                                            <BsTrash
                                              className="text-red-500"
                                              size={16}
                                            />
                                          ),
                                        },
                                        {
                                          key: 'toggle-expand-collapse',
                                          label: `${allSectionsCollapsed ? 'Expand' : 'Collapse'} all sections`,
                                          icon: allSectionsCollapsed ? (
                                            <BsChevronExpand size={18} />
                                          ) : (
                                            <BiCollapseVertical size={18} />
                                          ),
                                        },
                                        // {
                                        //   key: 'unpublished',
                                        //   label:
                                        //     'Move Unpublished frames at top',
                                        //   icon: (
                                        //     <IoIosArrowRoundUp
                                        //       className="rotate-180"
                                        //       size={18}
                                        //     />
                                        //   ),
                                        // },
                                        // {
                                        //   key: 'reset',
                                        //   label: 'Reset ordering of frames',
                                        //   icon: <RxReset size={16} />,
                                        // },
                                      ]}
                                      onAction={(key) =>
                                        handleSectionDropdownActions(
                                          section.id,
                                          key
                                        )
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

                              <div
                                style={{ flex: 2 }}
                                className="flex items-start gap-2">
                                <IoChevronDown
                                  className={cn(
                                    'text-xl duration-300 cursor-pointer text-black/50 -rotate-90 mt-1',
                                    {
                                      'rotate-0': expandedSections.includes(
                                        section.id
                                      ),
                                    }
                                  )}
                                  onClick={() =>
                                    dispatch(
                                      toggleSectionExpansionInPlannerAction({
                                        id: section.id,
                                      })
                                    )
                                  }
                                />
                                <div>
                                  <EditableLabel
                                    autoFocus={
                                      editable && itemIdToBeFocus === section.id
                                    }
                                    showTooltip={false}
                                    className={cn(
                                      'text-base font-semibold tracking-tight max-w-[31.25rem] text-black/70',
                                      {
                                        'border border-transparent hover:border-default':
                                          editable,
                                      }
                                    )}
                                    label={section.name}
                                    readOnly={preview}
                                    onUpdate={(value: string) => {
                                      updateSection({
                                        sectionPayload: { name: value },
                                        sectionId: section.id,
                                      })
                                    }}
                                  />
                                  <RenderIf
                                    isTrue={
                                      !expandedSections.includes(section.id)
                                    }>
                                    <SectionTime
                                      sectionId={section.id}
                                      frames={section.frames}
                                      config={section.config}
                                      editable={editable}
                                      className="mt-1 mb-2"
                                    />
                                  </RenderIf>
                                </div>
                              </div>
                              <RenderIf
                                isTrue={!expandedSections.includes(section.id)}>
                                <p className="w-24">
                                  {section.frames.length} Frames
                                </p>
                              </RenderIf>
                              <div
                                className={cn(
                                  'flex justify-between items-center gap-4 w-[18.75rem]',
                                  {
                                    'justify-end w-[16rem]': !editable,
                                  }
                                )}>
                                <SessionColorTracker
                                  colorCodes={section.frames.map((frame) => ({
                                    colorCode: frame?.config?.colorCode,
                                    timeSpan: frame?.config?.time,
                                  }))}
                                  className="h-5 w-full"
                                />
                                {/* <RenderIf isTrue={editable}>
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
                                </RenderIf> */}
                              </div>
                            </div>

                            <RenderIf
                              isTrue={expandedSections.includes(section.id)}>
                              <SectionTime
                                sectionId={section.id}
                                frames={section.frames}
                                config={section.config}
                                editable={editable}
                                className="mb-3 pl-2"
                              />
                            </RenderIf>

                            <RenderIf
                              isTrue={
                                sections.length === 1 &&
                                section.frames.length === 0
                              }>
                              <div className="mt-16">
                                <EmptyPlaceholder
                                  icon={
                                    <Image
                                      src="/images/empty-section.svg"
                                      width={400}
                                    />
                                  }
                                  title="Get Started with Frames"
                                  description="Your space is blank right now. Add some frames to visualize your event and take the first step in your planning journey"
                                  actionButton={
                                    <Button
                                      onClick={() => {
                                        dispatch(setIsPreviewOpenAction(false))
                                        addFrameToSection({
                                          frame: getBlankFrame('Frame 1'),
                                          section: sections[0],
                                        })
                                      }}
                                      color="primary"
                                      startContent={<MdAdd size={28} />}>
                                      Add frame
                                    </Button>
                                  }
                                />
                              </div>
                            </RenderIf>

                            <RenderIf
                              isTrue={
                                expandedSections.includes(section.id) &&
                                !(
                                  sections.length === 1 &&
                                  section.frames.length === 0
                                )
                              }>
                              <FramesList
                                section={section}
                                frames={section.frames.filter(
                                  (f) => !f?.content?.breakoutFrameId
                                )}
                                frameIdToBeFocus={itemIdToBeFocus}
                              />
                            </RenderIf>

                            <RenderIf isTrue={editable && sections.length > 0}>
                              <div
                                className={cn(
                                  'relative flex items-center w-full h-5 opacity-0 hover:opacity-100 cursor-pointer group/add-section duration-100',
                                  {
                                    'translate-y-[10px]':
                                      expandedSections.includes(
                                        sections[sectionIndex + 1]?.id
                                      ),
                                  }
                                )}
                                onClick={() => {
                                  setInsertInSectionId(section.id)
                                  setInsertAfterSectionId(section.id)
                                  addSection({
                                    afterSectionId: section.id,
                                  })
                                }}>
                                <div className="w-full h-[1px] bg-primary-200" />
                                <div className="flex items-center px-4 gap-2 text-gray-400">
                                  {isAddSectionLoading ? (
                                    <Loading />
                                  ) : (
                                    <MdAdd
                                      size={24}
                                      className="shrink-0 text-primary"
                                    />
                                  )}

                                  <p className="min-w-max text-xs text-primary font-medium">
                                    Add Section
                                  </p>
                                </div>
                                <div className="w-full h-[1px] bg-primary-200" />

                                <div />
                              </div>
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
