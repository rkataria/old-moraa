import { useContext } from 'react'

import { Button, cn } from '@nextui-org/react'
import { BsBookmarkFill } from 'react-icons/bs'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function OverviewButton({ label }: { label?: string }) {
  const { overviewOpen, eventMode, setOverviewOpen } = useContext(
    EventContext
  ) as EventContextType

  const handleOverviewClick = () => {
    setOverviewOpen(true)
  }

  if (eventMode === 'present') return <div />

  return (
    <Button
      startContent={<BsBookmarkFill size={18} />}
      className={cn(
        'hover:bg-primary-200 bg-transparent w-full justify-start font-semibold text-md p-3',
        {
          'bg-primary-200': overviewOpen,
          'justify-center': !label,
        }
      )}
      onClick={handleOverviewClick}>
      {label}
    </Button>
  )
}
