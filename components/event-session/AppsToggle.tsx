/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useState } from 'react'

import { TbApps } from 'react-icons/tb'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { Timer } from './Timer'
import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function AppsToggle() {
  const [isContentVisible, setIsContentVisible] = useState(false) // Set initial state to false
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const collapsePopoverContent = () => {
    setIsContentVisible(false) // Set visibility to false when collapsing
  }

  const togglePopoverContent = () => {
    setIsContentVisible(true) // Ensure PopoverContent is always visible when the button is clicked
  }

  return (
    <Popover placement="bottom" offset={15}>
      {isHost && (
        <PopoverTrigger>
          <div>
            <ControlButton
              buttonProps={{
                isIconOnly: true,
                radius: 'md',
                variant: 'flat',
                className: cn('transition-all duration-300', {
                  'bg-black text-white': isContentVisible,
                }),
              }}
              tooltipProps={{
                content: 'Mora apps',
              }}
              onClick={togglePopoverContent}>
              <TbApps size={20} />
            </ControlButton>
          </div>
        </PopoverTrigger>
      )}
      <PopoverContent
        hidden={!isContentVisible}
        className="p-1 bg-black/90 min-w-[500px] aspect-video text-white flex justify-start items-start">
        <Timer
          collapsePopoverContent={collapsePopoverContent}
          dismissPopover={collapsePopoverContent} // Pass dismissPopover function
        />
      </PopoverContent>
    </Popover>
  )
}
