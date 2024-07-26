import { useContext } from 'react'

import { Button } from '@nextui-org/react'
import { BsPlusSquare } from 'react-icons/bs'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AddContentButton({ className }: { className?: string }) {
  const { setOpenContentTypePicker } = useContext(
    EventContext
  ) as EventContextType
  const { leftSidebarVisiblity } = useStudioLayout()
  const { permissions } = useEventPermissions()

  const { preview, eventMode } = useContext(EventContext) as EventContextType

  const expanded = leftSidebarVisiblity === 'maximized'

  if (preview || !permissions.canCreateFrame || eventMode !== 'edit') {
    return <div />
  }

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <Button
        fullWidth={expanded}
        isIconOnly={!expanded}
        radius="md"
        variant="ghost"
        color="primary"
        className="flex justify-center items-center gap-2 shadow-lg tracking-tight"
        onClick={() => {
          setOpenContentTypePicker?.(true)
        }}>
        {expanded && <span>Add Frame</span>}
        <BsPlusSquare size={16} />
      </Button>
    </div>
  )
}
