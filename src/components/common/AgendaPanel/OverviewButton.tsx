import { useContext } from 'react'

import { cn } from '@nextui-org/react'
import { MdOutlineHomeWork } from 'react-icons/md'

import { Button } from '@/components/ui/Button'
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

  const isIconOnly = !label

  return (
    <Button
      size="sm"
      fullWidth={!isIconOnly}
      isIconOnly={isIconOnly}
      startContent={<MdOutlineHomeWork size={20} />}
      className={cn(
        'font-semibold bg-transparent flex justify-start hover:bg-gray-200',
        {
          'bg-primary-100': overviewOpen,
          'flex justify-center items-center m-auto': isIconOnly,
        }
      )}
      onClick={handleOverviewClick}>
      {label}
    </Button>
  )
}
