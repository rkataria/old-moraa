/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import {
  Dispatch,
  Key,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Button, Checkbox, Chip } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { Draggable } from 'react-beautiful-dnd'
import { BsArrowsAngleExpand, BsTrash } from 'react-icons/bs'
import { IoCheckmarkCircle, IoChevronDownSharp } from 'react-icons/io5'
import { MdDragIndicator, MdUnpublished } from 'react-icons/md'
import { PiNoteBlankLight } from 'react-icons/pi'

import { FrameColorCode } from './FrameColorCode'
// eslint-disable-next-line import/no-cycle
import { FramesList } from './FramesList'
import { Minutes } from './Minutes'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { DropdownActions } from '@/components/common/DropdownActions'
import { EditableLabel } from '@/components/common/EditableLabel'
import { Note } from '@/components/common/Note'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  setCurrentFrameIdAction,
  setIsOverviewOpenAction,
} from '@/stores/slices/event/current-event/event.slice'
import { setActiveTabAction } from '@/stores/slices/layout/studio.slice'
import { FrameStatus } from '@/types/enums'
import { IFrame, ISection } from '@/types/frame.type'
import { getBlankFrame, getBreakoutFrames } from '@/utils/content.util'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function FrameItem({
  section,
  frame,
  frameIndex,
  frameIdToBeFocus,
  selectedFrameIds,
  editable = false,
  setSelectedFrameIds,
  className = '',
  parentBreakoutFrame,
}: {
  section: ISection
  frame: IFrame
  frameIndex: number
  frameIdToBeFocus?: string
  selectedFrameIds: string[]
  editable: boolean
  setSelectedFrameIds: Dispatch<SetStateAction<string[]>>
  className?: string
  parentBreakoutFrame?: IFrame | null
}) {
  const router = useRouter()
  const {
    isOwner,
    preview,
    insertAfterFrameId,
    insertInSectionId,
    sections,
    updateFrame,
    setAddedFromSessionPlanner,
    deleteFrame,
    addFrameToSection,
  } = useEventContext()
  const currentFrame = useCurrentFrame()
  const [visibleNestedList, setVisibleNestedList] = useState(false)
  const dispatch = useStoreDispatch()
  const frameRef = useRef<HTMLDivElement>(null)

  const sectionId = section.id

  useEffect(() => {
    if (!frameRef.current) return

    if (currentFrame?.id !== frame.id) return

    frameRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [frameRef, currentFrame, frame.id])

  const onFrameTitleChange = (frameId: string, title: string) => {
    if (!editable) return
    const changedKey = frame.type === FrameType.POLL ? 'question' : 'title'

    updateFrame({
      frameId,
      framePayload: {
        name: title,
        content: {
          ...frame.content,
          [changedKey]: title,
        },
      },
    })
  }

  const changeFrameStatus = (frameNew: IFrame) => {
    const newState =
      frameNew.status === FrameStatus.PUBLISHED
        ? FrameStatus.DRAFT
        : FrameStatus.PUBLISHED
    updateFrame({
      frameId: frame.id,
      framePayload: {
        status: newState,
      },
    })
    if (
      frame.type === FrameType.BREAKOUT &&
      frame?.content?.breakoutRooms?.length
    ) {
      if (frame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS) {
        frame?.content?.breakoutRooms?.map((ele) => {
          if (ele?.activityId) {
            updateFrame({
              frameId: ele?.activityId,
              framePayload: {
                status: newState,
              },
            })
          }

          return 0
        })
      } else if (frame?.config?.breakoutType === BREAKOUT_TYPES.GROUPS) {
        if (frame?.content?.groupActivityId) {
          updateFrame({
            frameId: frame?.content?.groupActivityId,
            framePayload: {
              status: newState,
            },
          })
        }
      }
    }
  }

  const updateTime = (updatedTime: number) => {
    const timeKey =
      frame.type === FrameType.BREAKOUT ? 'breakoutDuration' : 'time'
    updateFrame({
      frameId: frame.id,
      framePayload: {
        config: {
          ...frame.config,
          [timeKey]: updatedTime,
        },
      },
    })
  }

  const handleBreakoutActivityFrameDelete = (breakoutFrame: IFrame | null) => {
    if (!breakoutFrame) return
    let payload = {}

    if (breakoutFrame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...breakoutFrame.content,
          breakoutRooms:
            breakoutFrame.content?.breakoutRooms?.map((activity) =>
              activity.activityId === frame.id
                ? { ...activity, activityId: null }
                : activity
            ) || [],
        },
      }
    } else {
      payload = {
        content: {
          ...breakoutFrame.content,
          groupActivityId: null,
        },
      }
    }

    updateFrame({ framePayload: payload, frameId: breakoutFrame.id })
    deleteFrame(frame)
  }

  const handleFrameDropdownActions = (key: Key) => {
    if (
      key === 'delete' &&
      frame?.content?.breakoutFrameId &&
      parentBreakoutFrame
    ) {
      handleBreakoutActivityFrameDelete(parentBreakoutFrame)

      return
    }

    if (key === 'delete') {
      deleteFrame(frame)
    }
  }

  const onChangeSelect = (checked: boolean) => {
    if (checked) {
      setSelectedFrameIds([...selectedFrameIds, frame.id])

      return
    }
    setSelectedFrameIds(selectedFrameIds.filter((id) => id !== frame.id))
  }

  const breakoutFrames = getBreakoutFrames({
    frames: sections.find((s) => s.id === sectionId)?.frames || [],
    breakoutFrame: frame,
  })
  const navigateToFrameContent = (frameId: string) => {
    dispatch(setCurrentFrameIdAction(frameId))
    dispatch(setIsOverviewOpenAction(false))
    dispatch(setActiveTabAction('content-studio'))
    router.navigate({
      search: (prev) => ({
        ...prev,
        tab: 'content-studio',
        frameId,
      }),
    })
  }

  return (
    <>
      <Draggable
        key={`frame-draggable-${frame.id}`}
        draggableId={`frame-draggable-frameId-${frame.id}`}
        index={frameIndex}
        isDragDisabled={!editable}>
        {(_provided, snapshot) => (
          <div
            id={frame.id}
            key={frame.id}
            ref={_provided.innerRef}
            {..._provided.draggableProps}
            className={cn(
              'relative z-[10] w-full bg-white min-h-[40px] group/frame grid hover:bg-gray-50 border-b last:border-none last:rounded-b-xl hover:shadow-sm duration-300',
              className,
              {
                'grid-cols-[40px_100px_120px_1fr_1fr_70px]': editable,
                'grid-cols-[100px_120px_1fr_1fr_130px]': !editable,
                'grid-cols-[40px_1fr_1fr_70px]':
                  parentBreakoutFrame && editable,
                'grid-cols-[1fr_1fr_130px]': parentBreakoutFrame && !editable,

                'before:absolute before:w-1.5 before:bg-primary-300 before:h-full before:top-0 before:-left-1.5 last:before:h-[88%]':
                  insertAfterFrameId === frame.id && editable,
                '!bg-primary-50':
                  frameIdToBeFocus === frame.id ||
                  selectedFrameIds.includes(frame.id),
                'bg-primary-50': currentFrame?.id === frame.id,
              }
            )}>
            <RenderIf isTrue={!!parentBreakoutFrame}>
              <div
                className={cn(
                  'absolute -left-10 top-3 w-[34px] h-3 border-b-2  rounded-bl-lg',
                  {
                    'border-primary-100':
                      insertInSectionId === sectionId && editable,
                  }
                )}
              />
            </RenderIf>
            <div className="absolute flex flex-col items-center justify-center -ml-[38px] -mr-4 opacity-0 w-[50px] group-hover/frame:opacity-100">
              <RenderIf isTrue={editable}>
                <div>
                  <RenderIf isTrue={!parentBreakoutFrame}>
                    <DropdownActions
                      triggerIcon={
                        <Button
                          isIconOnly
                          variant="light"
                          className="w-auto h-auto min-w-1"
                          isDisabled={snapshot.isDragging}
                          {..._provided.dragHandleProps}>
                          <MdDragIndicator className="text-gray-400" />
                        </Button>
                      }
                      actions={[
                        {
                          key: 'delete',
                          label: 'Delete frame',
                          icon: <BsTrash className="text-red-500" size={16} />,
                        },
                      ]}
                      onAction={handleFrameDropdownActions}
                    />
                  </RenderIf>
                </div>
              </RenderIf>
              <RenderIf isTrue={!parentBreakoutFrame}>
                <AddItemBar
                  sectionId={sectionId}
                  frameId={frame.id}
                  onAddFrame={() => {
                    addFrameToSection({
                      frame: getBlankFrame(
                        `Frame ${(section?.frames?.length || 0) + 1}`
                      ),
                      section,
                      afterFrameId: frame.id,
                    })
                  }}
                  trigger={
                    <p
                      className="text-xl text-gray-400 cursor-pointer"
                      onClick={() => {
                        dispatch(setCurrentFrameIdAction(frame?.id))
                        setAddedFromSessionPlanner(true)
                      }}>
                      +
                    </p>
                  }
                />
              </RenderIf>
            </div>
            <RenderIf isTrue={editable}>
              <div className="grid place-items-center border-r">
                <Checkbox
                  size="md"
                  isSelected={selectedFrameIds.includes(frame.id)}
                  onValueChange={onChangeSelect}
                  disabled={!isOwner}
                  classNames={{
                    wrapper: 'mr-0 grid',
                    icon: 'text-white',
                  }}
                />
              </div>
            </RenderIf>

            <RenderIf isTrue={!editable && !parentBreakoutFrame}>
              <div className="grid place-items-center">
                {frame.config?.breakoutDuration || frame.config?.time || 0} min
              </div>
            </RenderIf>

            <RenderIf isTrue={editable && !parentBreakoutFrame}>
              <Minutes
                minutes={
                  frame.config?.breakoutDuration || frame.config?.time || 0
                }
                onChange={updateTime}
                className="grid p-2 place-items-center"
              />
            </RenderIf>
            <RenderIf isTrue={!parentBreakoutFrame}>
              <FrameColorCode frameId={frame.id} config={frame.config} />
            </RenderIf>

            <div
              ref={frameRef}
              className="relative rounded-md flex items-center gap-1 group/color_code p-2 pl-6 min-w-[100px] group/frame-name cursor-pointer"
              style={{ flex: 3 }}
              onClick={() => navigateToFrameContent(frame.id)}>
              <ContentTypeIcon frameType={frame.type} />

              <EditableLabel
                autoFocus={editable && frameIdToBeFocus === frame.id}
                wrapperClass="min-w-[40%] max-w-[70%]"
                showTooltip={false}
                className={cn('text-sm max-w-fit rounded-sm', {
                  'cursor-text border border-transparent hover:border-gray-300 min-w-full':
                    editable,
                })}
                readOnly={!editable}
                label={frame.name}
                onUpdate={(value) => onFrameTitleChange(frame.id, value)}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
              <div className="absolute items-center gap-4 right-4 top-[50%] -translate-y-[50%] h-full hidden group-hover/frame-name:flex text-primary">
                <RenderIf isTrue={!!breakoutFrames}>
                  <p
                    className="flex items-center gap-2 cursor-pointer h-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setVisibleNestedList(!visibleNestedList)
                    }}>
                    <IoChevronDownSharp className=" text-primary" size={18} />
                    {visibleNestedList ? 'Hide items' : 'Subitems'}
                  </p>
                </RenderIf>

                <p className="flex items-center gap-2 cursor-pointer">
                  <BsArrowsAngleExpand className=" text-primary" size={12} />
                  Open
                </p>
              </div>
            </div>

            {/* <Tags frameId={frame.id} config={frame.config} /> */}

            <Note
              frameId={frame.id}
              note={frame.notes}
              placeholder={preview ? '' : 'Type your note here'}
              editable={editable}
              className="border-x-1 px-4 py-2 cursor-text"
              wrapOnBlur
            />

            <RenderIf isTrue={editable}>
              <div className="grid items-center justify-center scale-75">
                <Tooltip
                  content="Publish slide to make it visible to participants"
                  offset={20}
                  color="primary"
                  showArrow
                  radius="sm">
                  <Checkbox
                    size="lg"
                    isSelected={frame.status === FrameStatus.PUBLISHED}
                    onChange={() => changeFrameStatus(frame)}
                    disabled={!isOwner}
                    classNames={{ wrapper: 'mr-0', icon: 'text-white' }}
                    color={
                      frame.status === FrameStatus.PUBLISHED
                        ? 'success'
                        : 'default'
                    }
                  />
                </Tooltip>
              </div>
            </RenderIf>
            <RenderIf isTrue={!editable}>
              <div className="grid place-items-center">
                <Chip
                  variant="light"
                  size="sm"
                  color="default"
                  startContent={
                    frame.status === FrameStatus.PUBLISHED ? (
                      <IoCheckmarkCircle
                        className=" rounded-full text-green-500"
                        size={18}
                      />
                    ) : (
                      <MdUnpublished
                        className=" rounded-full text-gray-500"
                        size={18}
                      />
                    )
                  }>
                  {frame.status === FrameStatus.PUBLISHED
                    ? 'Shared'
                    : 'Not Shared'}
                </Chip>
              </div>
            </RenderIf>
          </div>
        )}
      </Draggable>
      <RenderIf isTrue={!!breakoutFrames && visibleNestedList}>
        <RenderIf isTrue={!!breakoutFrames && breakoutFrames?.length > 0}>
          <FramesList
            section={section}
            frames={breakoutFrames || []}
            placeholder={false}
            className="px-8 w-[60%] my-4"
            parentBreakoutFrame={frame}
          />
        </RenderIf>

        <RenderIf isTrue={breakoutFrames?.length === 0}>
          <div className="grid place-items-center text-center w-full py-10 bg-primary-50 gap-4">
            <PiNoteBlankLight size={32} className="text-primary" />
            <p className="text-primary">
              No activity added yet.{' '}
              <span
                className="font-medium underline cursor-pointer"
                onClick={() => navigateToFrameContent(frame.id)}>
                Add one
              </span>
            </p>
          </div>
        </RenderIf>
      </RenderIf>
    </>
  )
}
