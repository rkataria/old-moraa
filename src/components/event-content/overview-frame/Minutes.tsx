/* eslint-disable radix */
import { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export function Minutes({ frame }: { frame: IFrame }) {
  const [minutes, setMinutes] = useState(parseInt(frame.config?.time) || 0)
  const debouncedMin = useDebounce(minutes, 500)

  const { updateFrame } = useContext(EventContext) as EventContextType

  useEffect(() => {
    if (debouncedMin === frame.config.time) return
    updateFrame({
      frameId: frame.id,
      framePayload: {
        config: {
          ...frame.config,
          time: debouncedMin,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, frame.config.time])

  return (
    <div>
      <Input
        type="number"
        variant="bordered"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={minutes as any}
        classNames={{
          inputWrapper: 'h-6 min-h-6 p-0 overflow-hidden',
          input: 'w-[47px] text-center',
          helperWrapper: 'text-center p-0',
          mainWrapper: 'gap-0.5',
        }}
        description="minutes"
        startContent={
          <Button
            variant="light"
            onClick={() => setMinutes(minutes - 1)}
            className="px-1 min-w-2">
            -
          </Button>
        }
        endContent={
          <Button
            variant="light"
            onClick={() => setMinutes(minutes + 1)}
            className="px-1 min-w-2">
            +
          </Button>
        }
        onChange={(e) => setMinutes(parseInt(e.target.value))}
      />
    </div>
  )
}
