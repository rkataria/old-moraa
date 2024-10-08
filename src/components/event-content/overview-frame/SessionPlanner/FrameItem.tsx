/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { Dispatch, Key, SetStateAction, useContext } from 'react'

import { Button, Checkbox, Chip } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { Draggable } from 'react-beautiful-dnd'
import { BsArrowsAngleExpand, BsTrash } from 'react-icons/bs'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { MdDragIndicator, MdUnpublished } from 'react-icons/md'

import { FrameColorCode } from './FrameColorCode'
import { Minutes } from './Minutes'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { ContentType } from '@/components/common/ContentTypePicker'
import { DropdownActions } from '@/components/common/DropdownActions'
import { EditableLabel } from '@/components/common/EditableLabel'
import { Note } from '@/components/common/Note'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch } from '@/hooks/useRedux'
import {
  setCurrentFrameIdAction,
  setIsOverviewOpenAction,
} from '@/stores/slices/event/current-event/event.slice'
import { setActiveTabAction } from '@/stores/slices/layout/studio.slice'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FrameItem({
  section,
  frame,
  frameIndex,
  frameIdToBeFocus,
  selectedFrameIds,
  setSelectedFrameIds,
}: {
  section: ISection
  frame: IFrame
  frameIndex: number
  frameIdToBeFocus: string
  selectedFrameIds: string[]
  setSelectedFrameIds: Dispatch<SetStateAction<string[]>>
}) {
  const router = useRouter()
  const {
    isOwner,
    preview,
    eventMode,
    insertAfterFrameId,
    updateFrame,
    setAddedFromSessionPlanner,
    deleteFrame,
  } = useContext(EventContext) as EventContextType

  const dispatch = useStoreDispatch()
  const { permissions } = useEventPermissions()

  const editable =
    permissions.canUpdateFrame && !preview && eventMode === 'edit'

  const onFrameTitleChange = (frameId: string, title: string) => {
    if (!editable) return
    const changedKey = frame.type === ContentType.POLL ? 'question' : 'title'

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
      frame.type === ContentType.BREAKOUT &&
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
      frame.type === ContentType.BREAKOUT ? 'breakoutDuration' : 'time'
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

  const handleFrameDropdownActions = (key: Key) => {
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

  return (
    <Draggable
      key={`frame-draggable-${frame.id}`}
      draggableId={`frame-draggable-frameId-${frame.id}`}
      index={frameIndex}
      isDragDisabled={!editable}>
      {(_provided) => (
        <div
          id={frame.id}
          key={frame.id}
          ref={_provided.innerRef}
          {..._provided.draggableProps}
          className={cn(
            'relative w-full bg-white min-h-[3.125rem] group/frame grid grid-cols-[40px_100px_12px_1fr_1fr_70px] hover:bg-gray-50 border-b last:border-none last:rounded-b-xl hover:shadow-sm duration-300',
            {
              'grid-cols-[100px_12px_1fr_1fr_130px]': preview,
              'before:absolute before:w-1.5 before:bg-primary-300 before:h-full before:top-0 before:-left-1.5 last:before:h-[88%]':
                insertAfterFrameId === frame.id && !preview,
              '!bg-primary-50':
                frameIdToBeFocus === frame.id ||
                selectedFrameIds.includes(frame.id),
            }
          )}>
          <div className="absolute flex flex-col items-center justify-center -ml-[38px] -mr-4 opacity-0 w-[50px] group-hover/frame:opacity-100">
            <RenderIf isTrue={!preview}>
              <div>
                <DropdownActions
                  triggerIcon={
                    <Button
                      isIconOnly
                      variant="light"
                      className="w-auto h-auto min-w-1"
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
                  onAction={(key) => handleFrameDropdownActions(key)}
                />
              </div>
            </RenderIf>

            <AddItemBar
              sectionId={section.id}
              frameId={frame.id}
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

          <RenderIf isTrue={preview}>
            <div className="grid place-items-center">
              {frame.config?.breakoutDuration || frame.config.time || 0} min
            </div>
          </RenderIf>
          <RenderIf isTrue={editable}>
            <Minutes
              minutes={
                frame.config?.breakoutDuration || frame.config?.time || 0
              }
              onChange={updateTime}
              className="grid p-2 place-items-center"
            />
          </RenderIf>

          <FrameColorCode
            frameId={frame.id}
            config={frame.config}
            editable={editable}
          />

          <div
            className="relative rounded-md flex items-center gap-1 group/color_code p-2 pl-6 min-w-[100px] group/frame-name cursor-pointer"
            style={{ flex: 3 }}
            onClick={() => {
              dispatch(setCurrentFrameIdAction(frame.id))
              dispatch(setIsOverviewOpenAction(false))
              dispatch(setActiveTabAction('content-studio'))
              router.navigate({
                search: (prev) => ({
                  ...prev,
                  tab: 'content-studio',
                  frameId: frame.id,
                }),
              })
            }}>
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
            <p className="gap-2 items-center text-primary absolute right-4 top-[50%] -translate-y-[50%] hidden group-hover/frame-name:flex cursor-pointer">
              <BsArrowsAngleExpand className=" text-primary" size={12} />
              Open
            </p>
          </div>

          {/* <Tags frameId={frame.id} config={frame.config} /> */}

          <Note
            frameId={frame.id}
            note={frame.notes}
            placeholder={preview ? '' : 'Type your note here'}
            editable={editable}
            className="border-x-1 p-4 cursor-text"
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
  )
}
