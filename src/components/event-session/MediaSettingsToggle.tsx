import { ButtonProps } from '@nextui-org/button'
import { LuSettings } from 'react-icons/lu'

import { ControlButton } from '../common/ControlButton'

type MediaSettingsToggleProps = {
  label?: string
  buttonProps?: ButtonProps
  onClick: () => void
}
export function MediaSettingsToggle({
  label,
  buttonProps = {},
  onClick,
}: MediaSettingsToggleProps) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: !label,
        size: 'sm',
        ...buttonProps,
      }}
      tooltipProps={{
        label: 'Setting',
      }}
      onClick={onClick}>
      <LuSettings size={20} />
      {label}
    </ControlButton>
  )
}
