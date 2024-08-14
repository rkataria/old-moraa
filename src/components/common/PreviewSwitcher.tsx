import { useContext } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { CiEdit } from 'react-icons/ci'
import { LuCheck } from 'react-icons/lu'

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
    <Button
      size="sm"
      color="primary"
      startContent={!preview ? <LuCheck size={16} /> : <CiEdit size={16} />}
      onClick={handlePreviewSwitcher}>
      {preview ? 'Edit' : 'Done editing'}
    </Button>
  )
}
