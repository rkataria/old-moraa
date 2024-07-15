import { useContext } from 'react'

import { LuTv } from 'react-icons/lu'

import { Button } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function PreviewSwitcher() {
  const { preview, setPreview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateFrame) {
    return null
  }

  return (
    <Button
      color="danger"
      size="sm"
      radius="md"
      className={cn({
        'bg-[#7C3AED] text-white': !preview,
      })}
      endContent={<LuTv size={16} className="rotate-180" />}
      onClick={() => setPreview(!preview)}>
      {preview ? 'Exit Preview' : 'Preview'}
    </Button>
  )
}
