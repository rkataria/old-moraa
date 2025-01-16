/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { AssignmentOptionSelector } from '@/components/common/breakout/AssignmentOptionSelector'
import { AssignParticipantsModalTrigger } from '@/components/common/breakout/AssignParticipantsModal/AssignParticipantsModalTrigger'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { TwoWayNumberCounter } from '@/components/common/content-types/MoraaSlide/FontSizeControl'
import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function BreakoutSettings() {
  const { currentFrame, updateFrame, getFrameById, deleteFrame } = useContext(
    EventContext
  ) as EventContextType
  if (!currentFrame) return null

  const updateBreakout = (count: number) => {
    if (currentFrame?.config?.breakoutType === BREAKOUT_TYPES.GROUPS) {
      updateFrame({
        framePayload: {
          config: {
            ...currentFrame?.config,
            participantPerGroup: count,
          },
        },
        frameId: currentFrame.id,
      })

      return
    }
    if (count > currentFrame?.config?.breakoutRoomsCount) {
      updateFrame({
        framePayload: {
          config: {
            ...currentFrame?.config,
            breakoutRoomsCount: count,
          },
          content: {
            ...currentFrame?.content,
            breakoutRooms: [
              ...(currentFrame?.content?.breakoutRooms || []),
              {
                name: `Room - ${count}`,
                id: uuidv4(),
              },
            ],
          },
        },
        frameId: currentFrame.id,
      })
    } else {
      handleRoomsActivityDelete(
        currentFrame?.content?.breakoutRooms?.[count]?.activityId || '',
        count
      )
    }
  }
  const handleRoomsActivityDelete = (activityId: string, count: number) => {
    if (activityId) {
      deleteFrame(
        getFrameById(
          currentFrame?.content?.breakoutRooms?.[count]?.activityId || ''
        )
      )
    }
    // currentFrame?.content?.breakoutRooms?.pop()

    updateFrame({
      framePayload: {
        config: {
          ...currentFrame?.config,
          breakoutRoomsCount:
            (currentFrame?.content?.breakoutRooms?.length || 1) - 1,
        },
        content: {
          ...currentFrame?.content,
          breakoutRooms: currentFrame?.content?.breakoutRooms?.slice(0, -1),
        },
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <>
      <LabelWithInlineControl
        label="Duration"
        control={
          <TwoWayNumberCounter
            defaultCount={currentFrame?.config?.breakoutDuration as number}
            onCountChange={(count) => {
              updateFrame({
                framePayload: {
                  config: {
                    ...currentFrame?.config,
                    breakoutDuration: count,
                  },
                },
                frameId: currentFrame?.id,
              })
            }}
            noNegative
            postfixLabel="min"
          />
        }
      />

      <LabelWithInlineControl
        label={
          currentFrame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS
            ? 'No of rooms'
            : 'No of participants per group'
        }
        control={
          <TwoWayNumberCounter
            defaultCount={
              currentFrame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS
                ? currentFrame?.config?.breakoutRoomsCount
                : currentFrame?.config?.participantPerGroup
            }
            noNegative
            onCountChange={(count) => updateBreakout(count)}
            isDeleteModal={
              currentFrame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS
            }
          />
        }
      />

      <LabelWithInlineControl
        label="How participants can join"
        className="flex-col items-start"
        control={
          <AssignmentOptionSelector
            assignmentOption={currentFrame?.config?.assignmentOption}
            disabled={
              currentFrame?.config?.breakoutType === BREAKOUT_TYPES.GROUPS
            }
            onChange={(value) => {
              updateFrame({
                framePayload: {
                  config: {
                    ...currentFrame?.config,
                    assignmentOption: value,
                  },
                },
                frameId: currentFrame?.id,
              })
            }}
          />
        }
      />
      <RenderIf isTrue={currentFrame?.config?.assignmentOption === 'manual'}>
        <div className="flex items-center justify-between">
          <span>Assign Participants</span>
          <AssignParticipantsModalTrigger />
        </div>
      </RenderIf>
    </>
  )
}
