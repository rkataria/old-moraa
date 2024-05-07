/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { TbAppsFilled } from 'react-icons/tb'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function AppsToggle() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="bottom"
      offset={15}>
      <PopoverTrigger>
        <div>
          <ControlButton
            buttonProps={{
              isIconOnly: true,
              radius: 'full',
              variant: 'flat',
              className: cn('transition-all duration-300', {
                'bg-black text-white': isOpen,
              }),
            }}
            tooltipProps={{
              content: 'Mora apps',
            }}
            onClick={() => {
              setIsOpen((prev) => !prev)
            }}>
            <TbAppsFilled size={16} />
          </ControlButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-1 bg-black/90 min-w-[500px] aspect-video text-white">
        <div className="text-small font-bold">More controls coming soon!</div>
      </PopoverContent>
    </Popover>
  )
}
