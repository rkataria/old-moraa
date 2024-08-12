import { useContext } from 'react'

import { Button } from '@nextui-org/react'

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
    <div
      className={cn('flex justify-center items-center shadow-2xl', className)}>
      <Button
        fullWidth={expanded}
        isIconOnly={!expanded}
        radius="md"
        color="primary"
        className="flex items-center justify-center gap-2 tracking-tight "
        endContent={
          <span className="flex w-[18px] h-[18px] border text-center justify-center items-center rounded-sm text-lg">
            +
          </span>
        }
        onClick={() => {
          setOpenContentTypePicker?.(true)
        }}>
        {expanded && <span>Add Frame</span>}
      </Button>
    </div>
  )
}
