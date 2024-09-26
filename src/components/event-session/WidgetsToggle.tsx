import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { TbApps } from 'react-icons/tb'

import { MeetingRecordingButton } from './MeetingRecordingButton'
import { Timer } from './Timer'
import { WhiteBoardToggle } from './WhiteBoardToggle'
import { BreakoutHeaderButton } from '../common/breakout/BreakoutToggleButton'
import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

export function WidgetsToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      placement="top"
      showArrow
      offset={10}
      isOpen={isOpen}
      onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          className={cn({
            'bg-primary-100': isOpen,
          })}>
          <TbApps size={20} strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[240px] rounded-md p-2">
        <div className="flex justify-start items-start gap-2">
          <WhiteBoardToggle />
          <BreakoutHeaderButton />
          <Timer />
          <MeetingRecordingButton />
        </div>
      </PopoverContent>
    </Popover>
  )
}
