import { useContext } from 'react'

import { LuEye } from 'react-icons/lu'

import { Button } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function PreviewSwitcher() {
  const { preview, setPreview } = useContext(EventContext) as EventContextType

  return (
    <Button
      isIconOnly
      radius="full"
      size="sm"
      className={cn({
        'bg-black text-white': preview,
        'bg-gray-200 text-black': !preview,
      })}
      onClick={() => setPreview(!preview)}>
      <LuEye size={16} />
    </Button>
  )
}
