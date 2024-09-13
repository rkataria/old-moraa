/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { useContext } from 'react'

import { Switch } from '@nextui-org/react'
import { Draggable } from 'react-beautiful-dnd'
import {
  MdCheckCircle,
  MdOutlineDragIndicator,
  MdOutlinePublish,
} from 'react-icons/md'

import { FrameColorCode } from './FrameColorCode'
import { Minutes } from './Minutes'
import { Note } from './Note'
import { Tags } from './Tags'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EditableLabel } from '@/components/common/EditableLabel'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch } from '@/hooks/useRedux'
import { setCurrentFrameIdAction } from '@/stores/slices/event/current-event/event.slice'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FrameItem({
  section,
  frame,
  frameIndex,
  plannerWidth,
}: {
  section: ISection
  frame: IFrame
  frameIndex: number
  plannerWidth: number
}) {
  const {
    isOwner,
    preview,
    eventMode,
    updateFrame,
    setAddedFromSessionPlanner,
    insertAfterFrameId,
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
    updateFrame({
      frameId: frame.id,
      framePayload: {
        config: {
          ...frame.config,
          time: updatedTime,
        },
      },
    })
  }

  const showToggle = plannerWidth > 766

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
            'relative w-full bg-white group/frame grid grid-cols-[100px_12px_1fr_1fr_1fr] hover:bg-gray-50',
            {
              'grid-cols-[100px_12px_1fr_1fr_1fr_0.2fr]': showToggle,
              'grid-cols-[100px_12px_1fr_1fr_1fr]': preview,
              'before:absolute before:w-2 before:bg-primary-300 before:h-[108%] before:-top-0.5 before:-left-2 ':
                insertAfterFrameId === frame.id && !preview,
            }
          )}>
          <div className="absolute flex flex-col items-center justify-center -ml-[43px] -mr-4 opacity-0 w-[50px] group-hover/frame:opacity-100">
            <RenderIf isTrue={!preview}>
              <div {..._provided.dragHandleProps}>
                <MdOutlineDragIndicator
                  height={40}
                  width={30}
                  className="text-gray-400"
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

            <RenderIf
              isTrue={frame.status !== FrameStatus.PUBLISHED && !showToggle}>
              <MdOutlinePublish
                className="text-xl text-gray-400 cursor-pointer 2xl:hidden"
                onClick={() => changeFrameStatus(frame)}
              />
            </RenderIf>
            <RenderIf
              isTrue={frame.status === FrameStatus.PUBLISHED && !showToggle}>
              <MdCheckCircle
                className="text-green-600 cursor-pointer 2xl:hidden"
                onClick={() => changeFrameStatus(frame)}
              />
            </RenderIf>
          </div>

          <Minutes
            minutes={frame.config?.time || 0}
            onChange={updateTime}
            className="grid p-2 place-items-center"
          />

          <FrameColorCode frameId={frame.id} config={frame.config} />

          <div
            className="rounded-md flex items-center gap-1 group/color_code p-2 min-w-[100px]"
            style={{ flex: 3 }}>
            <ContentTypeIcon frameType={frame.type} />

            <EditableLabel
              showTooltip={false}
              className="text-sm"
              readOnly={!editable}
              label={frame.name}
              onUpdate={(value) => onFrameTitleChange(frame.id, value)}
            />
          </div>
          <Tags frameId={frame.id} config={frame.config} />

          <Note
            frameId={frame.id}
            notes={frame.notes}
            placeholder={preview ? '' : 'Click here to add notes'}
          />
          {editable && (
            <div
              className={cn('items-center justify-center scale-75 hidden', {
                grid: showToggle,
              })}>
              <Tooltip
                content="Share with participants"
                offset={20}
                color="primary"
                showArrow
                radius="sm">
                <Switch
                  size="sm"
                  isSelected={frame.status === FrameStatus.PUBLISHED}
                  onChange={() => changeFrameStatus(frame)}
                  disabled={!isOwner}
                  classNames={{ wrapper: 'mr-0' }}
                  color={
                    frame.status === FrameStatus.PUBLISHED
                      ? 'success'
                      : 'default'
                  }
                />
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
