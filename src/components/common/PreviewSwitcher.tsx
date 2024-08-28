import { useContext } from 'react'

import { Switch, SwitchThumbIconProps } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { IoEyeSharp } from 'react-icons/io5'
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
      <MdEdit size={16} className="text-white" />
    ) : (
      <IoEyeSharp size={16} {...props} className="text-white" />
    )

  return (
    <Tooltip
      label={preview ? 'Switch to edit mode' : 'Switch to preview mode'}
      actionKey={preview ? 'E' : 'P'}>
      <Switch
        size="lg"
        isSelected={!preview}
        onClick={handlePreviewSwitcher}
        thumbIcon={getThumbIcon}
        classNames={{
          wrapper: 'mr-0 !bg-white border',
          thumb: 'bg-primary !shrink-0',
        }}
        endContent={<MdEdit size={16} color="gray" />}
        startContent={<IoEyeSharp size={16} color="gray" />}
      />
    </Tooltip>
  )
}
