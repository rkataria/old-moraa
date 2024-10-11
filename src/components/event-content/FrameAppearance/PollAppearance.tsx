import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PollAppearance() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <div className="flex flex-col gap-4">
      <SwitchControl
        label="Allow votes on multiple options"
        checked={currentFrame.config.allowVoteOnMultipleOptions}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteOnMultipleOptions:
                  !currentFrame.config.allowVoteOnMultipleOptions,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
      <SwitchControl
        label="Allow anonymous votes"
        checked={currentFrame.config.allowVoteAnonymously}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteAnonymously: !currentFrame.config.allowVoteAnonymously,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
      {/* <div>
        <p className="">Visualization Types</p>
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="light"
            isIconOnly
            className={cn({
              'border-1 border-purple-800 text-purple-800':
                currentFrame.config.visualization === 'horizontal' ||
                !currentFrame.config.visualization,
            })}
            onClick={() =>
              updateFrame({
                framePayload: {
                  config: {
                    ...currentFrame.config,
                    visualization: 'horizontal',
                  },
                },
                frameId: currentFrame.id,
              })
            }>
            <PiChartBarHorizontal className="text-2xl" />
          </Button>
          <Button
            variant="light"
            isIconOnly
            className={cn({
              'border-1 border-purple-800 text-purple-800':
                currentFrame.config.visualization === 'vertical',
            })}
            onClick={() =>
              updateFrame({
                framePayload: {
                  config: {
                    ...currentFrame.config,
                    visualization: 'vertical',
                  },
                },
                frameId: currentFrame.id,
              })
            }>
            <PiChartBarHorizontal className="text-2xl -rotate-90" />
          </Button>
        </div>
      </div> */}
    </div>
  )
}
