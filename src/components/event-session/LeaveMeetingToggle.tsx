import { useState } from 'react'

import { DyteDialogManager } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { TbDoorExit } from 'react-icons/tb'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

type LeaveMeetingToggleProps = {
  showLabel?: boolean
}

export function LeaveMeetingToggle({ showLabel }: LeaveMeetingToggleProps) {
  const { meeting } = useDyteMeeting()
  const [states, setStates] = useState({})

  // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
  const setState = (s: any) => setStates((states: any) => ({ ...states, ...s }))

  return (
    <div>
      <ControlButton
        buttonProps={{
          radius: 'md',
          size: 'sm',
          variant: 'flat',
          className: cn('transition-all duration-300 bg-red-500 text-white'),
          isIconOnly: !showLabel,
          startContent: <TbDoorExit size={16} className="text-white" />,
        }}
        tooltipProps={{
          label: 'Leave meeting',
        }}
        onClick={() => setState({ activeLeaveConfirmation: true })}>
        {showLabel ? 'Leave' : null}
      </ControlButton>

      <DyteDialogManager
        meeting={meeting}
        states={states}
        onDyteStateUpdate={(e) => setState(e.detail)}
      />
    </div>
  )
}
