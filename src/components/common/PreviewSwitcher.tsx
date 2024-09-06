import { useContext } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { MdEdit } from 'react-icons/md'

import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

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
