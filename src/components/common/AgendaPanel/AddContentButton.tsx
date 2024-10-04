import { useContext } from 'react'

import { AiOutlinePlusSquare } from 'react-icons/ai'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AddContentButton({ className }: { className?: string }) {
  const { setOpenContentTypePicker } = useContext(
    EventContext
  ) as EventContextType
  const { permissions } = useEventPermissions()

  const { preview, eventMode } = useContext(EventContext) as EventContextType

  if (preview || !permissions.canCreateFrame || eventMode !== 'edit') {
    return <div />
  }

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <Tooltip label="Add a new frame" actionKey="F">
        <Button
          size="sm"
          color="primary"
          fullWidth
          endContent={<AiOutlinePlusSquare size={18} />}
          onClick={() => {
            setOpenContentTypePicker?.(true)
          }}>
          Add frame
        </Button>
      </Tooltip>
    </div>
  )
}
