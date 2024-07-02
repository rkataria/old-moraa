/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react'

import { TwoWayNumberCounter } from '@/components/common/content-types/Canvas/FontSizeControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function BreakoutConfiguration() {
  const { currentFrame, updateFrame, getCurrentFrame, deleteFrame } =
    useContext(EventContext) as EventContextType
  if (!currentFrame) return null

  const updateBreakout = (count: number) => {
    if (count > currentFrame?.config?.breakoutCount) {
      updateFrame({
        framePayload: {
          config: {
            ...currentFrame?.config,
            breakoutCount: count,
          },
          content: {
            ...currentFrame?.content,
            breakoutDetails: [
              ...(currentFrame?.content?.breakoutDetails || []),
              {
                name: `${currentFrame?.config?.selectedBreakout} - ${count}`,
              },
            ],
          },
        },
        frameId: currentFrame.id,
      })
    } else {
      handleDelete(
        currentFrame?.content?.breakoutDetails?.[count]?.activityId || '',
        count
      )
    }
  }
  const handleDelete = (activityId: string, count: number) => {
    if (activityId) {
      deleteFrame(
        getCurrentFrame(
          currentFrame?.content?.breakoutDetails?.[count]?.activityId || ''
        )
      )
    }
    currentFrame?.content?.breakoutDetails?.pop()
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame?.config,
          breakoutCount:
            currentFrame?.content?.breakoutDetails?.length || 1 - 1,
        },
        content: {
          ...currentFrame?.content,
          breakoutDetails: currentFrame?.content?.breakoutDetails,
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
          incrementStep={5}
          postfixLabel="min"
        />
      </span>
      <span className="flex items-center justify-between">
        <span>No of {currentFrame?.config?.selectedBreakout as number}</span>
        <TwoWayNumberCounter
          defaultCount={currentFrame?.config?.breakoutCount}
          noNegative
          onCountChange={(count) => updateBreakout(count)}
          isDeleteModal
        />
      </span>
    </>
  )
}
