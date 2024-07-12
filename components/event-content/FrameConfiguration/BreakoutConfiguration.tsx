/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { TwoWayNumberCounter } from '@/components/common/content-types/Canvas/FontSizeControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function BreakoutConfiguration() {
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
    currentFrame?.content?.breakoutRooms?.pop()
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame?.config,
          breakoutRoomsCount:
            currentFrame?.content?.breakoutRooms?.length || 1 - 1,
        },
        content: {
          ...currentFrame?.content,
          breakoutRooms: currentFrame?.content?.breakoutRooms,
        },
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <>
      <span className="flex items-center justify-between">
        <span>Duration</span>
        <TwoWayNumberCounter
          defaultCount={currentFrame?.config?.breakoutTime as number}
          onCountChange={(count) => {
            updateFrame({
              framePayload: {
                config: {
                  ...currentFrame?.config,
                  breakoutTime: count,
                },
              },
              frameId: currentFrame?.id,
            })
          }}
          noNegative
          incrementStep={1}
          postfixLabel="min"
        />
      </span>
      <span className="flex items-center justify-between">
        <span>
          {currentFrame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS
            ? 'No of rooms'
            : 'No of participants per group'}
        </span>
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
          incrementStep={1}
        />
      </span>
    </>
  )
}
