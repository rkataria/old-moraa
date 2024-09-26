import { ButtonProps } from '@nextui-org/button'
import { MdVideoSettings } from 'react-icons/md'

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
      <MdVideoSettings size={20} />
      {label}
    </ControlButton>
  )
}
