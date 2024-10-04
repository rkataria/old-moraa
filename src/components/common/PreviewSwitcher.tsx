import { useContext } from 'react'

import { Switch } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { MdEdit } from 'react-icons/md'

import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

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

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="flex items-center gap-1 bg-white shadow-sm  p-2 rounded-lg cursor-pointer"
      onClick={handlePreviewSwitcher}>
      <Switch
        readOnly
        onValueChange={handlePreviewSwitcher}
        isSelected={!preview}
        size="sm"
        classNames={{
          base: cn('data-[selected=true]:border-primary'),
          wrapper: 'p-0 h-4 overflow-visible',
          thumb: cn(
            'w-6 h-6 border-2 shadow-lg',
            'group-data-[hover=true]:border-primary',
            'group-data-[selected=true]:ml-4'
          ),
        }}
      />
      <p className="text-xs">Editable</p>
    </div>
  )

  return (
    <Tooltip
      label={preview ? 'Edit' : 'Preview'}
      actionKey={preview ? 'E' : 'P'}
      isDisabled={!preview}>
      <Button
        variant={preview ? 'bordered' : 'solid'}
        size="sm"
        color="primary"
        onClick={handlePreviewSwitcher}
        className="border-1"
        startContent={preview ? <MdEdit size={20} /> : null}>
        {preview ? 'Edit' : 'Done editing'}
      </Button>
    </Tooltip>
  )
}
