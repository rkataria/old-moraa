import { useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'

import { SwitchControl } from '@/components/common/SwitchControl'
import { useEventContext } from '@/contexts/EventContext'
import { useFlags } from '@/flags/client'

export function MoraaBoardSettings() {
  const [allowToDraw, setAllowToDraw] = useState(false)
  const debouncedValue = useDebounce(allowToDraw, 500)
  const { flags } = useFlags()

  const { currentFrame, updateFrame } = useEventContext()

  useEffect(() => {
    if (!currentFrame) return

    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          allowToDraw: debouncedValue,
        },
      },
      frameId: currentFrame.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  if (!flags?.enable_drawing_on_board) return null

  return (
    <SwitchControl
      label="Allow users to draw on the board"
      checked={allowToDraw}
      onChange={() => setAllowToDraw((prev) => !prev)}
    />
  )
}
