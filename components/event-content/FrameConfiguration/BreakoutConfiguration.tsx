/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState } from 'react'

import { TwoWayNumberCounter } from '@/components/common/content-types/Canvas/FontSizeControl'
import { DeleteFrameModal } from '@/components/common/DeleteFrameModal'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export function BreakoutConfiguration() {
  const { currentFrame, updateFrame, getCurrentFrame, deleteFrame } =
    useContext(EventContext) as EventContextType
  if (!currentFrame) return null
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [selectedFrame, setSelectedFrame] = useState<string>('')
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
                name: `${currentFrame?.config?.breakoutType} - ${count}`,
              },
            ],
          },
        },
        frameId: currentFrame.id,
      })
    } else {
      setSelectedFrame(
        currentFrame?.content?.breakoutDetails?.[count]?.activityId
      )
    }
  }
  const handleDelete = (frame: IFrame) => {
    deleteFrame(frame)
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
        />
      </span>
      <span className="flex items-center justify-between">
        <span>No of {currentFrame?.config?.selectedBreakout as number}</span>
        <TwoWayNumberCounter
          defaultCount={currentFrame?.config?.breakoutCount}
          noNegative
          onCountChange={(count) => updateBreakout(count)}
        />
      </span>
      <DeleteFrameModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
        }}
        handleDelete={handleDelete}
        frame={getCurrentFrame(selectedFrame)}
      />
    </>
  )
}
