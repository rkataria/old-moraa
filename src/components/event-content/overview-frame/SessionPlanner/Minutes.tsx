/* eslint-disable radix */
import { useContext, useEffect, useState } from 'react'

import { Button, Input, InputProps } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function Minutes({
  minutes,
  className,
  onChange,
  inputProps,
}: {
  minutes: number
  className?: string
  onChange: (min: number) => void
  inputProps?: InputProps
}) {
  const { preview } = useContext(EventContext) as EventContextType
  const [updatedMinutes, setUpdatedMinutes] = useState(minutes || 0)
  const debouncedMin = useDebounce(updatedMinutes, 500)

  useEffect(() => {
    if (debouncedMin === minutes) return
    onChange(debouncedMin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, minutes])

  return (
    <div className={className}>
      <Input
        type="number"
        variant="bordered"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={updatedMinutes as any}
        isDisabled={preview}
        classNames={{
          innerWrapper: 'justify-between',
          inputWrapper:
            'h-6 min-h-6 p-0 overflow-hidden border-1 shadow-none rounded-md',
          input: 'w-[47px] text-center',
          helperWrapper: 'text-center p-0',
          mainWrapper: 'gap-0.5',
          base: '!opacity-100',
        }}
        // description="min"
        startContent={
          <Button
            isDisabled={preview}
            variant="light"
            onClick={() => setUpdatedMinutes(updatedMinutes - 1)}
            className="w-3 px-2 min-w-3">
            -
          </Button>
        }
        endContent={
          <Button
            isDisabled={preview}
            variant="light"
            onClick={() => setUpdatedMinutes(updatedMinutes + 1)}
            className="w-3 px-2 min-w-3">
            +
          </Button>
        }
        onChange={(e) => setUpdatedMinutes(parseInt(e.target.value))}
        {...inputProps}
      />
    </div>
  )
}
