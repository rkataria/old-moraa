import { useContext } from 'react'

import { BsBookmarkFill } from 'react-icons/bs'

import { Button, cn } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function OverviewButton({ label }: { label?: string }) {
  const { overviewOpen, preview, isOwner, eventMode, setOverviewOpen } =
    useContext(EventContext) as EventContextType

  const handleOverviewClick = () => {
    if (!isOwner) return
    if (preview) return
    if (eventMode !== 'edit') return

    setOverviewOpen(true)
  }

  if (!isOwner || eventMode === 'present') return <div />

  return (
    <Button
      startContent={<BsBookmarkFill size={18} />}
      className={cn(
        'hover:bg-purple-200 bg-transparent w-full justify-start font-semibold text-md p-3',
        {
          'bg-purple-200': overviewOpen,
          'justify-center': !label,
        }
      )}
      onClick={handleOverviewClick}>
      {label}
    </Button>
  )
}
