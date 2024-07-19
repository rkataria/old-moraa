/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext } from 'react'

import { Switch } from '@nextui-org/react'
import { Draggable } from 'react-beautiful-dnd'
import { MdOutlineDragIndicator } from 'react-icons/md'

import { Minutes } from './Minutes'

import { AddItemBar } from '@/components/common/AgendaPanel/AddItemBar'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EditableLabel } from '@/components/common/EditableLabel'
import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'

export function FrameItem({
  section,
  frame,
  frameIndex,
}: {
  section: ISection
  frame: IFrame
  frameIndex: number
}) {
  const { isOwner, preview, eventMode, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  const editable = isOwner && !preview && eventMode === 'edit'

  const onFrameTitleChange = (frameId: string, title: string) => {
    if (!editable) return

    updateFrame({
      frameId,
      framePayload: {
        name: title,
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

  return (
    <Draggable
      key={`frame-draggable-${frame.id}`}
      draggableId={`frame-draggable-frameId-${frame.id}`}
      index={frameIndex}
      isDragDisabled={!editable}>
      {(_provided) => (
        <div
          key={frame.id}
          ref={_provided.innerRef}
          {..._provided.draggableProps}
          className="flex w-full bg-white group/frame gap-[0.625rem]">
          <div className="flex flex-col items-center justify-center -ml-[49px] -mr-1 opacity-0 w-[50px] group-hover/frame:opacity-100">
            <div {..._provided.dragHandleProps}>
              <MdOutlineDragIndicator
                height={40}
                width={30}
                className="text-gray-400"
              />
            </div>

            <AddItemBar
              sectionId={section.id}
              frameId={frame.id}
              trigger={
                <p className="text-gray-400 text-xl cursor-pointer">+</p>
              }
            />
          </div>
          <div
            className="rounded-md overflow-hidden flex items-center gap-3"
            style={{ flex: 3 }}>
            <div className="border-r-[0.375rem] flex flex-col items-center gap-2 p-2">
              <ContentTypeIcon frameType={frame.type} />
              <Minutes frame={frame} />
            </div>
            <EditableLabel
              className="text-sm"
              readOnly={!editable}
              label={frame.name}
              onUpdate={(value) => onFrameTitleChange(frame.id, value)}
            />
          </div>
          <div
            className="flex items-center text-sm max-w-[28rem] pr-3"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: frame?.notes?.content || '' }}
          />
          {editable && (
            <div className="flex items-center justify-center pr-2">
              <Switch
                size="sm"
                isSelected={frame.status === FrameStatus.PUBLISHED}
                onChange={() => changeFrameStatus(frame)}
                disabled={!isOwner}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
