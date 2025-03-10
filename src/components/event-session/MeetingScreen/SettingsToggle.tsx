import { IoSettingsOutline } from 'react-icons/io5'

import { ControlButton } from '@/components/common/ControlButton'
import { useEventSession } from '@/contexts/EventSessionContext'
import { cn } from '@/utils/utils'

type SettingsToggleProps = {
  showLabel?: boolean
}

export function SettingsToggle({ showLabel }: SettingsToggleProps) {
  const { dyteStates, setDyteStates } = useEventSession()
  const handleSettingsToggle = () => {
    setDyteStates((prevDyteStates) => ({
      ...prevDyteStates,
      activeSettings: true,
    }))
  }

  const isSettingsModelOpen = !!dyteStates?.activeSettings

  return (
    <ControlButton
      buttonProps={{
        size: 'sm',
        variant: 'light',
        isIconOnly: !showLabel,
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isSettingsModelOpen,
        }),
        startContent: (
          <IoSettingsOutline
            size={16}
            className={cn({
              'text-primary-500': isSettingsModelOpen,
            })}
          />
        ),
      }}
      tooltipProps={{
        label: 'Open settings',
      }}
      onClick={handleSettingsToggle}>
      {showLabel ? 'Settings' : null}
    </ControlButton>
  )
}
