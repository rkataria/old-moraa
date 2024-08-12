import { useContext } from 'react'

import { Button } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { CiEdit } from 'react-icons/ci'
import { LuCheck } from 'react-icons/lu'

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
      color="primary"
      radius="md"
      className="shadow-md"
      startContent={!preview ? <LuCheck size={20} /> : <CiEdit size={20} />}
      onClick={handlePreviewSwitcher}>
      {preview ? 'Edit' : 'Done Editing'}
    </Button>
  )
}
