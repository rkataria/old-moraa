import { useContext } from 'react'

import { BsPlusSquare } from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AddContentButton({ className }: { className?: string }) {
  const { setOpenContentTypePicker } = useContext(
    EventContext
  ) as EventContextType
  const { leftSidebarVisiblity } = useStudioLayout()
  const { preview, isOwner, eventMode } = useContext(
    EventContext
  ) as EventContextType

  const expanded = leftSidebarVisiblity === 'maximized'

  if (preview || !isOwner || eventMode !== 'edit') return <div />

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <Button
        fullWidth={expanded}
        isIconOnly={!expanded}
        radius="md"
        variant="solid"
        className="bg-primary text-white flex justify-center items-center gap-2 shadow-lg"
        onClick={() => {
          setOpenContentTypePicker?.(true)
        }}>
        {expanded && <span>Add Frame</span>}
        <BsPlusSquare size={16} />
      </Button>
    </div>
  )
}
