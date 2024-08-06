import { useContext } from 'react'

import { Button } from '@nextui-org/react'
import { LuTv } from 'react-icons/lu'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'

export function PreviewSwitcher() {
  const { preview, setPreview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateFrame) {
    return null
  }

  return (
    <Button
      color={preview ? 'danger' : 'success'}
      radius="md"
      className="text-white"
      endContent={<LuTv size={16} className="rotate-180" />}
      onClick={() => setPreview(!preview)}>
      {preview ? 'Exit Preview' : 'Preview'}
    </Button>
  )
}
