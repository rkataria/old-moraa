/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react'

import { AssignmentOptionSelector } from '@/components/common/breakout/AssignmentOptionSelector'
import { AssignParticipantsModalTrigger } from '@/components/common/breakout/AssignParticipantsModal/AssignParticipantsModalTrigger'
import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { TwoWayNumberCounter } from '@/components/common/content-types/MoraaSlide/FontSizeControl'
import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventContext } from '@/contexts/EventContext'
import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { FrameService } from '@/services/frame.service'
import { EventContextType } from '@/types/event-context.type'

export function BreakoutSettings() {
  const { currentFrame, updateFrame, getFrameById, deleteFrame } = useContext(
    EventContext
  ) as EventContextType
  const breakoutActivityQuery = useBreakoutActivities({
    frameId: currentFrame!.id,
  })
  if (!currentFrame) return null

  const updateBreakout = async (count: number) => {
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
    if (count > (breakoutActivityQuery.data?.length || 1)) {
      await FrameService.createActivityBreakoutFrame([
        {
          breakoutFrameId: currentFrame!.id,
          name: 'Activity',
        },
      ])
      breakoutActivityQuery.refetch()
    } else {
      handleRoomsActivityDelete(
        breakoutActivityQuery.data![count].activity_frame_id!,
        breakoutActivityQuery.data![count].id!
      )
    }
  }
  const handleRoomsActivityDelete = async (
    activityFrameId: string,
    activityId: string
  ) => {
    if (activityFrameId) {
      deleteFrame(getFrameById(activityFrameId))
    }

    await FrameService.deleteActivityBreakoutFrame({
      activityId,
    })

    breakoutActivityQuery.refetch()
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
                ? breakoutActivityQuery.data?.length
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
