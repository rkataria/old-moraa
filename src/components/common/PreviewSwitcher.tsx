import { useContext } from 'react'

import { Switch, SwitchThumbIconProps } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { BsEyeFill } from 'react-icons/bs'
import { MdEdit } from 'react-icons/md'

import { Tooltip } from './ShortuctTooltip'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'

export function PreviewSwitcher() {
  const navigate = useNavigate()
  const { preview, setPreview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateFrame) {
    return null
  }

  const handlePreviewSwitcher = () => {
    setPreview(!preview)

    navigate({
      search: { action: preview ? 'edit' : 'view' },
    })
  }
  const getThumbIcon = (props: SwitchThumbIconProps) =>
    props.isSelected ? (
      <BsEyeFill size={12} className="text-primary" />
    ) : (
      <MdEdit size={12} {...props} className="text-primary" />
    )

  return (
    <Tooltip
      label={preview ? 'Switch to edit mode' : 'Switch to preview mode'}
      actionKey={preview ? 'E' : 'P'}>
      <Switch
        size="md"
        isSelected={preview}
        color="primary"
        onClick={handlePreviewSwitcher}
        thumbIcon={getThumbIcon}
        classNames={{ wrapper: 'mr-0' }}
      />
    </Tooltip>
  )
}
