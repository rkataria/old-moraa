import { useContext } from 'react'

import { Switch } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'

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
      className={cn(
        'flex items-center gap-1 h-8 bg-transparent border-1 p-2 rounded-md cursor-pointer',
        {
          'bg-primary-50 border-primary-300': !preview,
          'bg-transparent border-gray-200': preview,
        }
      )}
      onClick={handlePreviewSwitcher}>
      <Switch
        readOnly
        onValueChange={handlePreviewSwitcher}
        isSelected={!preview}
        size="sm"
        classNames={{
          base: cn('data-[selected=true]:border-primary'),
          wrapper: 'p-0 h-4 w-8 overflow-visible',
          thumb: cn(
            'w-4 h-4 border-1',
            'group-data-[hover=true]:border-primary',
            'group-data-[selected=true]:ml-4'
          ),
        }}
      />
      <p
        className={cn({
          'text-gray-500': preview,
          'text-primary-500': !preview,
        })}>
        Editable
      </p>
    </div>
  )
}
